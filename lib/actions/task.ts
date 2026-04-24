"use server";

import { db } from "@/config/db";
import { getSessionUserIdAction } from "./auth";
import { tasks } from "@/config/schema";
import { TaskFormValues } from "@/app/(routes)/tasks/create/_components/TaskForm";

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

    return { success: true, data: data };
  } catch (error) {
    console.log("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
};
