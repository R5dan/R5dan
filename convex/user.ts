import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
})

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId }) => {
    if (!clerkId) {
      return undefined;
    }
    return await ctx.db.query("users").withIndex("clerk", (q) => q.eq("id", clerkId)).unique();
  },
})

export const createUser = mutation({
  args: {
    id: v.string(),
    notify: v.boolean(),
  },
  handler: async (ctx, { id, notify }) => {
    return await ctx.db.insert("users", {
      id,
      notify,
      admin: false,
    });
  },
})

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    notify: v.boolean(),
  },
  handler: async (ctx, { id, notify }) => {
    return await ctx.db.patch(id, {
      notify,
    });
  },
})

export const deleteUser = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
})

export const getAdminUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").withIndex("admin", (q) => q.eq("admin", true)).collect();
  },
})

export const getNotifyUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").withIndex("notify", (q) => q.eq("notify", true)).collect();
  },
})

export const getNonAdminUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").withIndex("admin", (q) => q.eq("admin", false)).collect();
  },
})

export const getNonNotifyUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").withIndex("notify", (q) => q.eq("notify", false)).collect();
  },
})