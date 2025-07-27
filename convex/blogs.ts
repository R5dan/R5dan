import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getBlog = query({
  args: v.object({
    id: v.id("blogs"),
  }),
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const createBlog = mutation({
  args: v.object({
    title: v.string(),
    url: v.optional(v.string()),
    content: v.string(),
    description: v.string(),
    public: v.boolean(),
    listed: v.boolean(),
    image: v.id("_storage"),
  }),
  handler: async (
    ctx,
    { title, url, content, description, public: publicValue, listed, image },
  ) => {
    const id = await ctx.db.insert("blogs", {
      title,
      url: url ?? title.replace(" ", "-"),
      content,
      description,
      public: publicValue,
      listed,
      image,
      canSee: [],
    });
    return await ctx.db.get(id);
  },
});

export const updateBlog = mutation({
  args: v.object({
    id: v.id("blogs"),
    title: v.string(),
    content: v.string(),
    description: v.string(),
    isPublic: v.boolean(),
    listed: v.boolean(),
  }),
  handler: async (
    ctx,
    { id, title, content, description, isPublic, listed },
  ) => {
    const blog = await ctx.db.get(id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    await ctx.db.patch(id, {
      title,
      content,
      description,
      public: isPublic,
      listed,
    });
    return await ctx.db.get(id);
  },
});

export const uploadImage = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateBlogImage = mutation({
  args: v.object({
    id: v.id("blogs"),
    image: v.id("_storage"),
  }),
  handler: async (ctx, { id, image }) => {
    const blog = await ctx.db.get(id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    await ctx.db.patch(id, {
      image,
    });
    return await ctx.db.get(id);
  },
});

export const getBlogImage = query({
  args: v.object({
    id: v.optional(v.id("blogs")),
  }),
  handler: async (ctx, { id }) => {
    if (!id) {
      return null;
    }
    const blog = await ctx.db.get(id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    return await ctx.storage.getUrl(blog.image);
  },
});

export const deleteBlog = mutation({
  args: v.object({
    id: v.id("blogs"),
  }),
  handler: async (ctx, { id }) => {
    const blog = await ctx.db.get(id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    await ctx.db.delete(id);
    return await ctx.db.get(id);
  },
});

export const getLatest = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").order("desc").first();
    return blogs;
  },
});

export const getBlogs = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("public_listed", (q) =>
        q.eq("public", true).eq("listed", true),
      )

      .order("desc")
      .paginate(paginationOpts);
    return blogs;
  },
});

export const getBlogsForUserId = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      return await ctx.db
        .query("blogs")
        .withIndex("public_listed", (q) =>
          q.eq("public", true).eq("listed", true),
        )
        .order("desc")
        .collect();
    }
    const user = await ctx.db.get(userId);
    const publicBlogs = await ctx.db
      .query("blogs")
      .withIndex("public_listed", (q) =>
        q.eq("public", true).eq("listed", true),
      )
      .order("desc")
      .collect();

    if (!user) {
      return publicBlogs;
    }
    if (user.admin) {
      return await ctx.db.query("blogs").collect();
    }
    const userBlogs = await ctx.db
      .query("blogs")
      .filter((q) => q.field("canSee").contains(user._id))
      .collect();

    return publicBlogs.concat(userBlogs);
  },
});

export const getBlogByURL = query({
  args: {
    url: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { url, userId }) => {
    if (!url) {
      return null;
    }

    if (!userId) {
      return await ctx.db
        .query("blogs")
        .withIndex("public_url", (q) => q.eq("public", true).eq("url", url))
        .unique();
    }

    const user = await ctx.db.get(userId);

    const blog = await ctx.db
      .query("blogs")
      .withIndex("url", (q) => q.eq("url", url))
      .unique();

    if (!blog) {
      return null;
    }

    if (user) {
      if (user.admin) {
        return blog;
      }

      if (blog.canSee.includes(user._id)) {
        return blog;
      }
    }

    if (blog.public) {
      return blog;
    }

    return null;
  },
});
