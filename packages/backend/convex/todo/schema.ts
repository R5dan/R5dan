import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  message: defineTable({
    hidden: v.optional(v.string()),
    todo: v.id("todo"),
    reply: v.optional(v.id("message")),
  }),
  edit: defineTable({
    message: v.string(),
    messageId: v.id("message"),
  }),
  todo: defineTable({
    title: v.string(),
    description: v.string(),
    completedAt: v.optional(v.number()),
    related: v.array(v.id("todo")),
  }),
});
