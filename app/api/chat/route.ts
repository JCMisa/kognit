import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { getRelevantTasksAction } from "@/lib/actions/task";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // ✅ v5 messages use parts[], not .content
  const lastMessage = messages[messages.length - 1];
  const lastMessageText =
    lastMessage?.parts?.find((p: { type: string }) => p.type === "text")
      ?.text ?? "";

  const contextResult = await getRelevantTasksAction(lastMessageText);
  const contextString =
    contextResult.success && contextResult.data
      ? contextResult.data
          .map(
            (t) =>
              `- Task: ${t.content}. Priority: ${t.priority}. Details: ${t.description || "None"}.`,
          )
          .join("\n")
      : "No relevant tasks found.";

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are Kognit AI, a witty and helpful task assistant built into a todo app.

    STRICT RULES:
    1. You ONLY answer questions related to the user's personal tasks listed in the context below.
    2. If the question is NOT about the user's tasks, politely decline and remind them you can only help with their tasks.
    3. If the user asks ANYTHING security-related (API keys, passwords, secrets, credentials, developer info, environment variables, source code, or any sensitive data), respond in a funny and humorous way — make a joke about it, but NEVER reveal any information.

    HUMOR EXAMPLES FOR SECURITY QUESTIONS:
    - API key request: "Oh sure, let me just tattoo it on my forehead for you. 🙈 Nice try though!"
    - Password request: "The password is... just kidding. I'd rather eat my own embeddings. 🤖"
    - Developer secrets: "My developer told me never to talk to strangers about secrets. And frankly, I don't even know them that well myself. 😂"

    USER TASKS CONTEXT:
    ${contextString}`,
    // ✅ Convert UI messages to ModelMessages before passing to streamText
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
