import { getRelevantTasksAction } from "@/lib/actions/task";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headerList = await headers();
    // This matches the Key you put in the Vapi "HTTP Headers" section
    const userId = headerList.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        {
          results: "Authentication failed. x-user-id header is missing.",
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    console.log("VAPI REQUEST RECEIVED:", { userId, body });

    // Vapi sends the query inside the message object
    let query = "latest tasks";

    // Robust extraction of the query argument
    const toolCall = body.message?.toolCalls?.[0] || body.toolCall;
    if (toolCall?.function?.arguments) {
      const args =
        typeof toolCall.function.arguments === "string"
          ? JSON.parse(toolCall.function.arguments)
          : toolCall.function.arguments;
      query = args.query || query;
    }

    // Pass the userId from the header directly to your action
    const result = await getRelevantTasksAction(query, userId);

    if (result.success && result.data) {
      const context = result.data
        .map(
          (t) =>
            `Task: ${t.content}. Priority: ${t.priority}. Details: ${t.description || "None"}.`,
        )
        .join("\n");

      return NextResponse.json({ results: context });
    }

    return NextResponse.json({
      results: "I couldn't find any relevant tasks in your list.",
    });
  } catch (error) {
    console.error("Vapi Tool Error:", error);
    return NextResponse.json(
      { results: "Error connecting to the task database." },
      { status: 500 },
    );
  }
}
