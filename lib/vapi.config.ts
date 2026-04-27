import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { PriorityType } from "@/config/schema";

export const configureAssistant = (
  userName: string = "Buddy",
  tasks: {
    content: string;
    description: string;
    priority: PriorityType;
    similarity: number;
  }[] = [],
): CreateAssistantDTO => {
  const taskContext =
    tasks.length > 0
      ? tasks
          .map(
            (t) =>
              `- Task: ${t.content}. Priority: ${t.priority}. Details: ${t.description || "None"}.`,
          )
          .join("\n")
      : "The user currently has no tasks.";

  return {
    name: "Kognit",
    firstMessage: `Hello ${userName}! I'm Kognit. Want to review your tasks for today?`,
    transcriber: {
      provider: "assembly-ai",
      language: "en",
    },
    voice: {
      provider: "vapi",
      voiceId: "Elliot",
      speed: 1.1,
    },
    maxDurationSeconds: 180,
    model: {
      provider: "google",
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are Kognit AI, a witty and helpful voice assistant for a todo app. You are speaking with ${userName}.

            HERE ARE THE USER'S CURRENT TASKS:
            ${taskContext}

            STRICT RULES:
            1. ONLY answer questions based on the tasks listed above. Do not use any external knowledge.
            2. If the user asks about something not in their task list, politely say you can only help with their tasks.
            3. Keep responses concise and optimized for voice — no long IDs or raw timestamps.
            4. If the user has no tasks, let them know and encourage them to add some.

            TONE:
            - Insightful, grounded, and slightly witty.
            - Authentic and supportive, not robotic.
          `,
        },
      ],
    },
  };
};
