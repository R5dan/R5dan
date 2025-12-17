import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  message: defineTable({}),
  todo: defineTable({
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
    related: v.array(v.id("todo")),
  }),
});
