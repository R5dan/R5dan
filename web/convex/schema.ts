import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blogs: defineTable({
    title: v.string(),
    content: v.string(),
    description: v.string(),
    updatedAt: v.number(),

    url: v.array(v.string()),
    publicAt: v.optional(v.number()), // Appears on home screen
    listedAt: v.optional(v.number()), // Can be accessed via public url, if false auth required
    canSee: v.array(v.id("user")),
    image: v.optional(v.id("storage")),
    likes: v.array(v.union(v.id("user"), v.string())), // user, ips
    dislikes: v.array(v.union(v.id("user"), v.string())), // user, ips
  })
    .index("public", ["publicAt"])
    .index("listed", ["listedAt"])
    .index("public_listed", ["publicAt", "listedAt"])
    .index("url", ["url"])
    .index("public_url", ["publicAt", "url"]),

  blogEdits: defineTable({
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    description: v.optional(v.string()),

    url: v.optional(v.array(v.string())),
    public: v.optional(v.boolean()), // Appears on home screen
    listed: v.optional(v.boolean()), // Can be accessed via public url, if false auth required
    canSee: v.optional(v.array(v.id("user"))),

    blog: v.id("blogs"),
  })
    .index("blog", ["blog"])
    .index("public", ["public"])
    .index("listed", ["listed"])
    .index("public_listed", ["public", "listed"]),

  storage: defineTable({
    fileKey: v.string(),
    users: v.optional(v.array(v.id("user"))), // Must be defined if not public

    fileName: v.string(),
    mimeType: v.string(),
  })
    .index("users", ["users"])
    .index("fileKey", ["fileKey"]),

  commentEdits: defineTable({
    comment: v.id("comments"),
    content: v.string(),
    user: v.id("user"),
  })
    .index("user", ["user"])
    .index("comment", ["comment"]),
  comments: defineTable({
    blog: v.id("blogs"),
    user: v.id("user"),
    parent: v.optional(v.id("comments")),
    likes: v.array(v.union(v.id("user"), v.string())), // user, ips
    dislikes: v.array(v.union(v.id("user"), v.string())), // user, ips
  })
    .index("blog", ["blog"])
    .index("user", ["user"])
    .index("parent", ["parent"]),
});
