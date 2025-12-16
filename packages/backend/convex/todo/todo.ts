import { query, mutation } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

export const paginateTodos = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return ctx.db.query("todo").order("desc").paginate(args.paginationOpts);
  }
})

export const getTodo = query({
  args: {
    id: v.id("todo")
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  }
})

export const deleteTodo = mutation({
  args: {
    id: v.id("todo")
  },
  handler: async (ctx, args) => {
    ctx.db.delete(args.id);
  }
})

export const listTodos = query({
  handler: async (ctx) => {
    return ctx.db.query("todo");
  }
})

export const createMessage = mutation({
  args: {
    todo: v.string(),
    text: v.string(),
    reply: v.optional(v.id("message"))
  },
  handler: async (ctx, args) => {
    const mid = await ctx.db.insert("message", {
      todo: args.todo,
      reply: args.reply,
    });
    await ctx.db.insert("edit", {
      message: args.text,
      messageId: mid
    })
    return mid;
  }
})

export const getMessage = query({
  args: {
    id: v.id("message")
  },
  handler: async (ctx, args) => {
    const [message, edit] = await Promise.all([
      ctx.db.get(args.id),
      ctx.db.query("edit").withIndex("message", (q) => q.eq(args.id)).first()
    ])
    return {
      message,
      edit
    }
  }
})

export const getFullMessage = query({})

export const deleteMessage = mutation({
  args: {
    id: v.id("message")
  },
  handler: async (ctx, args) => {
    ctx.db.delete(args.id);
  }
})

export const editMessage = mutation({
  args: {
    id: v.id("message"),
    text: v.string()
  },
  handler: async (ctx, args) => {
    const edit = await ctx.db.insert("edit", {
      message: args.text,
      messageId: args.id
    });
    return edit;
  }
})

export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    related: v.array(v.id("todo"))
  },
  handler: async (ctx, args) => {
    ctx.db.insert("todo", {
      title: args.title,
      description: args.description,
      related: args.related
    })
  }
})

export const updateTodo = mutation({
  args: {
    id: v.id("todo"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    related: v.optional(v.array(v.id("todo"))),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      related: args.related,
      completedAt: args.completedAt
    })
  }
})