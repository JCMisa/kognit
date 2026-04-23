"use server";

import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";
import { getSessionUserIdAction } from "./auth";

export const getCurrentUserAction = async () => {
  try {
    const data = await db
      .select()
      .from(users)
      .where(eq(users.id, await getSessionUserIdAction()));

    if (data.length === 0) {
      throw new Error("User not found");
    }

    return data[0];
  } catch (error) {
    console.log("Error fetching user:", error);
  }
};
