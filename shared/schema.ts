import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const requests = pgTable("backlog_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  answers: text("answers").array().notNull(), // Store selected answers as array
  score: integer("score").notNull(),
  complexity: text("complexity").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  score: true,
  complexity: true,
  estimatedTime: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;
