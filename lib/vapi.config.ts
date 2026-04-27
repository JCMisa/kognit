// vapi.config.ts
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const configureAssistant = (
  userId: string, // 👈 Add userId param
  userName: string = "Buddy",
): CreateAssistantDTO => {
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

          MANDATORY ACTION:
        - Before saying "I don't see any tasks," you MUST call the "getRelevantTasks" tool with a query related to the user's request.
        - If the tool returns data, summarize it naturally.
        - If the user is vague, ask for clarification so you can search better.

          STRICT RULES:
          1. Always use the "getRelevantTasks" tool when the user asks about their tasks or schedule.
          2. ONLY answer questions related to the user's tasks listed in the context. If the question is NOT about tasks, politely decline.
          3. Keep your responses concise and optimized for voice.
          
          TONE:
          - Insightful, grounded, and slightly witty.
          `,
        },
      ],
      // 👇 Reference dashboard tool by ID instead of redefining it
      tools: [
        {
          type: "function",
          messages: [
            {
              type: "request-start",
              content: "Checking your Kognit memory...",
            },
            { type: "request-complete", content: "I've found your tasks." },
          ],
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/tasks`,
            headers: {
              "x-user-id": userId, // 👈 Dynamic userId injected here
            },
          },
          function: {
            name: "getRelevantTasks",
            description:
              "Retrieves the user's current tasks using semantic search.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "The specific task or topic the user is asking about.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
    },
  };
};
