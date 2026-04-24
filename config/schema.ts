import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  vector,
  index,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

// 1. Users Table (Synced via Clerk Webhooks)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // This will be the Clerk User ID (e.g., user_...)
  email: text("email").notNull().unique(),
  imageUrl: text("image_url"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Tasks Table
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Core Content
    content: text("content").notNull(),
    description: text("description"), // For the AI to have more context

    // Status & Organization
    isCompleted: boolean("is_completed").default(false).notNull(),
    priority: priorityEnum("priority").default("medium").notNull(),

    // Drag and Drop ordering
    // Using 'real' allows for easy reordering logic (fractional indexing)
    position: real("position").default(0).notNull(),

    // Time Management
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("user_id_idx").on(table.userId)],
);

// 3. Task Embeddings Table (For RAG)
// We keep this separate to keep the main tasks table lean and fast.
export const taskEmbeddings = pgTable(
  "task_embeddings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
    content: text("content").notNull(),
  },
  (table) => [
    // Change your index to this:
    index("embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  ],
);

// RELATIONS (Optional but highly recommended for Drizzle Queries)
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  embedding: one(taskEmbeddings, {
    fields: [tasks.id],
    references: [taskEmbeddings.taskId],
  }),
}));

// --- TYPE DEFINITIONS ---

// Users Types
export type UserType = InferSelectModel<typeof users>;
export type NewUserType = InferInsertModel<typeof users>;

// Tasks Types
export type TaskType = InferSelectModel<typeof tasks>;
export type NewTaskType = InferInsertModel<typeof tasks>;
export type PriorityType = "low" | "medium" | "high";

// Task Embeddings Types
export type TaskEmbeddingType = InferSelectModel<typeof taskEmbeddings>;
export type NewTaskEmbeddingType = InferInsertModel<typeof taskEmbeddings>;

// --- HELPER TYPES FOR YOUR UI ---

// This is useful for your Todo components where you might want
// to know if a task is currently being "processed" by the AI
export type TaskWithEmbeddingType = TaskType & {
  embedding?: TaskEmbeddingType;
};

// Useful for the Chatbot responses
export type ChatMessageType = {
  role: "user" | "assistant";
  content: string;
};
