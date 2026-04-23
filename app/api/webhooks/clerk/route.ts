import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { users } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Server configuration error", { status: 500 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers:", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get and verify body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const eventType = evt.type;
  console.log(`📩 Received webhook: ${eventType}`);

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, image_url, first_name, last_name } =
          evt.data;

        // Get primary email or null (don't create fake emails)
        const primaryEmail = email_addresses?.find(
          (email) => email.id === email_addresses[0]?.id,
        )?.email_address;

        if (!primaryEmail && eventType === "user.created") {
          console.error(`❌ User ${id} has no email address`);
          // Still return 200 so Clerk doesn't retry, but log the error
          return new Response("User has no email", { status: 200 });
        }

        // For updates, only update email if provided
        const updateData: Partial<typeof users.$inferInsert> = {
          imageUrl: image_url,
          firstName: first_name || "Anonymous User",
          lastName: last_name || "Anonymous User",

          updatedAt: new Date(),
        };

        if (primaryEmail) {
          updateData.email = primaryEmail;
        }

        await db
          .insert(users)
          .values({
            id: id,
            email: primaryEmail || `temp-${id}@placeholder.com`, // Temporary for insert
            imageUrl: image_url,
            firstName: first_name || "Anonymous User",
            lastName: last_name || "Anonymous User",
          })
          .onConflictDoUpdate({
            target: users.id,
            set: updateData,
          });

        console.log(
          `✅ User: ${id} ${eventType === "user.created" ? "created" : "updated"}`,
        );
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        // Soft delete or hard delete - here we hard delete
        await db.delete(users).where(eq(users.id, id as string));
        console.log(`🗑️ User ${id} deleted from database`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("❌ Database operation failed:", error);
    // Return 500 so Clerk will retry (webhooks should be idempotent)
    return new Response(
      JSON.stringify({
        error: "Database operation failed",
        details: String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
