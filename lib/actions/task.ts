"use server";

import { db } from "@/config/db";
import { getSessionUserIdAction } from "./auth";
import { tasks } from "@/config/schema";
import { TaskFormValues } from "@/app/(routes)/tasks/create/_components/TaskForm";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { and, desc, eq } from "drizzle-orm";

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
    const [data] = await db
      .insert(tasks)
      .values({
        userId: userId,
        content: formData.content,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      })
      .returning();

    if (!data) {
      console.log("Error creating task: No data returned");
      return { success: false, error: "Failed to create task" };
    }

    revalidateTag("tasks", "max");
    return { success: true, data: data };
  } catch (error) {
    console.log("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
};
