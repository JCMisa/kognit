"use server";

import { db } from "@/config/db";
import { getSessionUserIdAction } from "./auth";
import { taskEmbeddings, tasks } from "@/config/schema";
import { TaskFormValues } from "@/app/(routes)/tasks/create/_components/TaskForm";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const getAllUserTasksAction = async (userId: string) => {
  "use cache";

  try {
    cacheLife("hours");
    cacheTag("tasks");

    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));

    if (data.length === 0) {
      return { success: false, error: "No tasks found" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
};

export const getUserTaskByIdAction = async (taskId: string) => {
  "use cache";

  const userId = await getSessionUserIdAction();

  if (!userId) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    cacheLife("hours");
    cacheTag(`user-task-${taskId}`);

    const [data] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);

    if (!data) {
      return { success: false, error: "Task not found" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Error fetching task:", error);
    return { success: false, error: "Failed to fetch task" };
  }
};

export const createTaskAction = async (formData: TaskFormValues) => {
  const userId = await getSessionUserIdAction();

  if (!userId) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    // STEP 1: Create the Task first
    const [newTask] = await db
      .insert(tasks)
      .values({
        userId: userId,
        content: formData.content,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        position: 0,
      })
      .returning();

    if (!newTask) return { success: false, error: "Failed to save task." };

    // STEP 2: Generate the Vector Embedding
    // We do this AFTER saving the task so we have the real task ID
    try {
      const textToEmbed = `Task: ${newTask.content}. Context: ${newTask.description || "None"}`;

      const embeddingsResponse = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: textToEmbed,
        config: { outputDimensionality: 768 },
      });

      const embeddingVector = embeddingsResponse.embeddings?.[0]?.values;

      if (!embeddingVector) {
        throw new Error("No embedding values returned from Gemini");
      }

      // STEP 3: Save the Embedding
      await db.insert(taskEmbeddings).values({
        taskId: newTask.id,
        content: textToEmbed,
        embedding: embeddingVector,
      });
    } catch (aiError) {
      console.error("AI Embedding failed, but task was saved:", aiError);
      // We don't necessarily want to crash the whole app if the AI fails,
      // but we should warn the user that "Search/Chat" might not work for this task yet.
      return {
        success: true,
        data: newTask,
        warning: "Task saved, but AI memory failed to sync.",
      };
    }

    revalidateTag("tasks", "max");
    return { success: true, data: newTask };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Database connection failed." };
  }
};

export const getRelevantTasksAction = async (queryText: string) => {
  const userId = await getSessionUserIdAction();
  if (!userId) return { success: false, error: "Unauthenticated" };

  try {
    // 1. Generate embedding for the user's question
    const embeddingsResponse = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: queryText,
      config: { outputDimensionality: 768 },
    });

    const queryVector = embeddingsResponse.embeddings?.[0]?.values;
    if (!queryVector) throw new Error("Could not generate query vector");

    // 2. Perform Semantic Search using Drizzle Syntax
    // We calculate similarity as: 1 - (embedding <=> queryVector)
    const similarity = sql<number>`1 - (${taskEmbeddings.embedding} <=> ${JSON.stringify(queryVector)}::vector)`;

    const relevantTasks = await db
      .select({
        content: tasks.content,
        description: tasks.description,
        priority: tasks.priority,
        similarity: similarity,
      })
      .from(tasks)
      .leftJoin(taskEmbeddings, eq(tasks.id, taskEmbeddings.taskId))
      .where(
        and(
          eq(tasks.userId, userId),
          gt(similarity, 0.5), // Only return results with > 50% similarity
        ),
      )
      .orderBy(desc(similarity))
      .limit(5);

    return { success: true, data: relevantTasks };
  } catch (error) {
    console.error("Retrieval Error:", error);
    return { success: false, error: "Failed to search tasks" };
  }
};
