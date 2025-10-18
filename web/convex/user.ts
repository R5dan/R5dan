import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export const createUser = mutation({
  args: {
    id: v.string(),
    notify: v.boolean(),
  },
  handler: async (ctx, { id, notify }) => {
    return;
  },
});

export const createEmailUser = mutation({
  args: {
    email: v.string(),
    notify: v.boolean(),
  },
  handler: async (ctx, { email, notify }) => {
    return await ctx.db.insert("emailUsers", {
      email,
      notify,
    });
  },
});

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
});

export const updateEmailUser = mutation({
  args: {
    id: v.id("emailUsers"),
    notify: v.optional(v.boolean()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, { id, notify, email }) => {
    return await ctx.db.patch(id, {
      notify,
      email,
    });
  },
});

export const deleteUser = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});

export const deleteEmailUser = mutation({
  args: {
    id: v.id("emailUsers"),
  },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});

export const getAdminUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("admin", (q) => q.eq("admin", true))
      .collect();
  },
});

export const getNotifyAllUsers = query({
  handler: async (ctx) => {
    const usersPromise = ctx.db
      .query("users")
      .withIndex("notify", (q) => q.eq("notify", true))
      .collect();

    const emailUsersPromise = ctx.db
      .query("emailUsers")
      .withIndex("notify", (q) => q.eq("notify", true))
      .collect();

    const [users, emailUsers] = await Promise.all([
      usersPromise,
      emailUsersPromise,
    ]);
    return [...users, ...emailUsers];
  },
});

export const getNotifyUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("notify", (q) => q.eq("notify", true))
      .collect();
  },
});
export const getNotifyEmailUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("emailUsers")
      .withIndex("notify", (q) => q.eq("notify", true))
      .collect();
  },
});

export const getNonAdminUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("admin", (q) => q.eq("admin", false))
      .collect();
  },
});

export const getNonNotifyUsers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("notify", (q) => q.eq("notify", false))
      .collect();
  },
});

export const convertEmailToUser = mutation({
  args: {
    email: v.id("emailUsers"),
    clerkId: v.string(),
  },
  handler: async (ctx, { email, clerkId }) => {
    const user = await ctx.db.get(email);
    if (!user) {
      return null;
    }

    const userId = await ctx.db.insert("users", {
      id: clerkId,
      notify: user.notify,
      admin: false,
    });
    return userId;
  },
});
