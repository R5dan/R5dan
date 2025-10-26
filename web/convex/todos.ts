import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createTodo = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    description: v.string(),
    remindAt: v.optional(
      v.array(
        v.object({
          t: v.number(),
          d: v.boolean(),
        }),
      ),
    ),
    priority: v.int64(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("todo", {
      ...args,
      user: user._id,
      updatedAt: Date.now(),
    });
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todo"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    description: v.optional(v.string()),
    remindAt: v.optional(
      v.array(
        v.object({
          t: v.number(),
          d: v.boolean(),
        }),
      ),
    ),
    priority: v.optional(v.int64()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

export const deleteTodo = mutation({
  args: {
    id: v.id("todo"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(args.id);
  },
});

export const getTodos = query({
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("todo")
      .withIndex("user", (q) => q.eq("user", user._id))
      .collect();
  },
});

export const getTodo = query({
  args: {
    id: v.id("todo"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new Error("Not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      return null;
    }

    if (todo.user !== user._id) {
      throw new Error("Not authorized");
    }

    return todo;
  },
});
