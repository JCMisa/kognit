"use server";

import { auth } from "@clerk/nextjs/server";

export const getSessionUserIdAction = async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return userId;
};
