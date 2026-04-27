"use server";

import { db } from "@/config/db";
import { getSessionUserIdAction } from "./auth";
import { taskEmbeddings, tasks } from "@/config/schema";
import { TaskFormValues } from "@/app/(routes)/tasks/_components/TaskForm";
import { revalidatePath } from "next/cache";
import { and, asc, desc, eq, gt, sql } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const getAllUserTasksAction = async (userId: string) => {
  // "use cache";

  try {
    // cacheLife("hours");
    // cacheTag("tasks");

    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(asc(tasks.position));

    if (data.length === 0) {
      return { success: false, error: "No tasks found" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
};

export const getUserTaskByIdAction = async (taskId: string, userId: string) => {
  // "use cache";

  try {
    // cacheLife("hours");
    // cacheTag(`user-task-${taskId}`);

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
        imageUrl: formData.imageUrl,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        position: 0,
      })
      .returning();

    if (!newTask) return { success: false, error: "Failed to save task." };

    // STEP 2: Generate the Vector Embedding
    // We do this AFTER saving the task so we have the real task ID
    try {
      // const textToEmbed = `Task: ${newTask.content}. Context: ${newTask.description || "None"}. Attached Image: ${!!newTask.imageUrl}`;
      const textToEmbed = `Task: ${newTask.content}. Context: ${newTask.description || "None"}. Is completed: ${newTask.isCompleted}. Priority: ${newTask.priority}. Due data: ${newTask.dueDate ? newTask.dueDate.toISOString() : "None"}. Created at: ${newTask.createdAt.toISOString()}`;

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

    // revalidateTag("tasks", "max");
    revalidatePath("/tasks");
    return { success: true, data: newTask };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Database connection failed." };
  }
};

// lib/actions/task.ts

export const getRelevantTasksAction = async (
  queryText: string,
  manualUserId?: string,
) => {
  // Check manualUserId first (for Vapi), fallback to session (for Chatbot)
  const userId = manualUserId || (await getSessionUserIdAction());

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
      .where(and(eq(tasks.userId, userId), gt(similarity, 0.5)))
      .orderBy(desc(similarity))
      .limit(5);

    return { success: true, data: relevantTasks };
  } catch (error) {
    console.error("Retrieval Error:", error);
    return { success: false, error: "Failed to search tasks" };
  }
};

export const reorderTasksAction = async (
  reorderedTasks: { id: string; position: number }[],
) => {
  try {
    // Fire all updates. If one fails, the whole block throws an error.
    await Promise.all(
      reorderedTasks.map((task) =>
        db
          .update(tasks)
          .set({ position: task.position, updatedAt: new Date() })
          .where(eq(tasks.id, task.id)),
      ),
    );

    // revalidateTag("tasks", "max");
    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Manual Batch Reorder failed:", error);
    return { success: false, error: "Sync failed. Please refresh your list." };
  }
};

export const updateTaskStatusAction = async (
  taskId: string,
  isCompleted: boolean,
  taskContent: string,
) => {
  const userId = await getSessionUserIdAction();

  if (!userId) {
    return { success: false, error: "Unauthenticated" };
  }

  try {
    // 1. Clean the incoming content string to remove existing "(Completed)" tags
    // This uses a Regex to find "(Completed)" and any surrounding extra spaces
    const baseContent = taskContent.replace(/\s*\(Completed\)\s*/gi, "").trim();

    // 2. Generate the final content string based on the new status
    const finalContent = isCompleted
      ? `${baseContent} (Completed)`
      : baseContent;

    const data = await db
      .update(tasks)
      .set({
        content: finalContent,
        isCompleted: isCompleted,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    if (!data || data.length === 0) {
      return { success: false, error: "Task not found or update failed" };
    }

    revalidatePath("/tasks");
    return { success: true, data: data[0] };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Database connection failed." };
  }
};

export const updateTaskAction = async (
  taskId: string,
  formData: TaskFormValues,
) => {
  const userId = await getSessionUserIdAction();
  if (!userId) return { success: false, error: "Unauthenticated" };

  try {
    // 1. Update the Task in Neon
    const [updatedTask] = await db
      .update(tasks)
      .set({
        content: formData.content,
        description: formData.description,
        imageUrl: formData.imageUrl,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();

    if (!updatedTask) return { success: false, error: "Task not found." };

    // 2. Update the Embedding (Sync RAG Memory)
    try {
      const textToEmbed = `Task: ${updatedTask.content}. Context: ${updatedTask.description || "None"}. Is completed: ${updatedTask.isCompleted}. Priority: ${updatedTask.priority}. Due date: ${updatedTask.dueDate ? updatedTask.dueDate.toISOString() : "None"}`;

      const embeddingsResponse = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: textToEmbed,
        config: { outputDimensionality: 768 },
      });

      const embeddingVector = embeddingsResponse.embeddings?.[0]?.values;

      if (embeddingVector) {
        await db
          .update(taskEmbeddings)
          .set({
            content: textToEmbed,
            embedding: embeddingVector,
          })
          .where(eq(taskEmbeddings.taskId, updatedTask.id));
      }
    } catch (aiError) {
      console.error("AI Sync failed during update:", aiError);
    }

    revalidatePath("/tasks");
    // revalidateTag(`user-task-${taskId}`, "max");
    return { success: true, data: updatedTask };
  } catch (error) {
    console.log("Database Error:", error);
    return { success: false, error: "Update failed." };
  }
};

export const deleteTaskAction = async (taskId: string) => {
  const userId = await getSessionUserIdAction();
  if (!userId) return { success: false, error: "Unauthenticated" };

  try {
    await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
    revalidatePath("/tasks");
    // revalidateTag(`user-task-${taskId}`, "max");
    return { success: true };
  } catch (error) {
    console.log("Database Error:", error);
    return { success: false, error: "Delete failed." };
  }
};
