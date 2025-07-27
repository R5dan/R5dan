import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blogs: defineTable({
    title: v.string(),
    content: v.string(),
    description: v.string(),

    url: v.string(),
    public: v.boolean(),
    listed: v.boolean(),
    canSee: v.array(v.id("users")),
    image: v.id("_storage"),
  })
    .index("public", ["public"])
    .index("listed", ["listed"])
    .index("public_listed", ["public", "listed"])
    .index("url", ["url"])
    .index("public_url", ["public", "url"]),

  users: defineTable({
    id: v.string(),

    notify: v.boolean(),
    admin: v.boolean(),
  })
    .index("clerk", ["id"])
    .index("admin", ["admin"])
    .index("notify", ["notify"]),
});
