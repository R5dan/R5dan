import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent, createAuth } from "./auth";
import { paginationOptsValidator, type DocumentByName } from "convex/server";
import type { DataModel } from "./_generated/dataModel";

type PatchValue<T> = {
  [P in keyof T]?: undefined extends T[P] ? T[P] | undefined : T[P];
};

const ERROR_CODES = {
  Unauthenticated: "Unauthenticated",
  Unauthorized: "Unauthorized",
  BlogNotFound: "Blog Not Found",
};

export const getBlogById = query({
  args: {
    id: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const promises = [
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ] as const;
    const data = await ctx.db.get(args.id);

    if (!data) {
      throw new Error(ERROR_CODES.BlogNotFound);
    }

    if (data.listedAt) {
      return data;
    }
    const [{ auth }, user] = await Promise.all(promises);
    if (!user) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }

    if (
      data.canSee.includes(user._id) ||
      (await auth.api.userHasPermission({
        body: {
          userId: user._id,
          permission: {
            blogs: ["read"],
          },
        },
      }))
    ) {
      return data;
    }

    throw new Error(ERROR_CODES.Unauthorized);
  },
});

export const getBlogDeploymentById = query({
  args: {
    id: v.id("deployment"),
    blog: v.id("blogs"),
  },
  handler: async (ctx, args) => {
    const promises = [
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ] as const;
    const [blog, deployment1] = await Promise.all([
      ctx.db.get(args.blog),
      ctx.db.get(args.id),
    ]);
    if (!(deployment1 && blog)) {
      throw new Error(ERROR_CODES.BlogNotFound);
    }
    let deployment;
    if (blog._id !== deployment1.blog) {
      deployment = await ctx.db.get(blog.defaultDeployment!);
      if (!deployment) {
        throw new Error(ERROR_CODES.BlogNotFound);
      }
    } else {
      deployment = deployment1;
    }

    if (blog.listedAt) {
      return { blog, deployment };
    }

    const [{ auth }, user] = await Promise.all(promises);
    if (!user) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }

    if (
      blog.canSee.includes(user._id) ||
      (await auth.api.userHasPermission({
        body: {
          userId: user._id,
          permission: {
            blogs: ["read"],
          },
        },
      }))
    ) {
      return { blog, deployment };
    }

    throw new Error(ERROR_CODES.Unauthorized);
  },
});

export const getBlogDeploymentByUrl = query({
  args: {
    id: v.id("deployment"),
    blog: v.string(),
  },
  handler: async (ctx, args) => {
    const promises = [
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ] as const;
    const [blog, deployment1] = await Promise.all([
      ctx.db
        .query("blogs")
        .withIndex("url", (q) => q.eq("url", args.blog))
        .unique(),
      ctx.db.get(args.id),
    ]);
    if (!(deployment1 && blog)) {
      throw new Error(ERROR_CODES.BlogNotFound);
    }
    let deployment;
    if (blog._id !== deployment1.blog) {
      deployment = await ctx.db.get(blog.defaultDeployment!);
      if (!deployment) {
        throw new Error(ERROR_CODES.BlogNotFound);
      }
    } else {
      deployment = deployment1;
    }

    if (blog.listedAt) {
      return { blog, deployment };
    }

    const [{ auth }, user] = await Promise.all(promises);
    if (!user) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }

    if (
      blog.canSee.includes(user._id) ||
      (await auth.api.userHasPermission({
        body: {
          userId: user._id,
          permission: {
            blogs: ["read"],
          },
        },
      }))
    ) {
      return { blog, deployment };
    }

    throw new Error(ERROR_CODES.Unauthorized);
  },
});

export const getDefaultDeploymentByUrl = query({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("url", (q) => q.eq("url", args.url))
      .unique();
    if (!blog) {
      throw new Error(ERROR_CODES.BlogNotFound);
    }
    return blog.defaultDeployment!;
  },
});

export const getBlogByUrl = query({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const promises = [
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ] as const;
    const data = await ctx.db
      .query("blogs")
      .withIndex("url", (q) => q.eq("url", args.url))
      .unique();

    if (!data) {
      throw new Error(ERROR_CODES.BlogNotFound);
    }

    if (data.listedAt) {
      return data;
    }

    const [{ auth }, user] = await Promise.all(promises);
    if (!user) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }

    if (
      data.canSee.includes(user._id) ||
      (await auth.api.userHasPermission({
        body: {
          userId: user._id,
          permission: {
            blogs: ["read"],
          },
        },
      }))
    ) {
      return data;
    }
  },
});

export const addBlog = mutation({
  args: {
    blog: v.object({
      title: v.string(),
      content: v.string(),
      description: v.string(),

      url: v.optional(v.string()),
      public: v.optional(v.boolean()), // Appears on home screen
      listed: v.optional(v.boolean()), // Can be accessed via public url, if false auth required
      canSee: v.optional(v.array(v.id("user"))),
      image: v.optional(v.id("storage")),
      imageAlt: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { blog }) => {
    const [{ auth }, user] = await Promise.all([
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ]);
    if (!user || !auth) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }

    const hasPerm = await auth.api.userHasPermission({
      body: {
        userId: user._id,
        permission: {
          blogs: ["create"],
        },
      },
    });

    if (!hasPerm) {
      throw new Error(ERROR_CODES.Unauthorized);
    }

    const blogId = await ctx.db.insert("blogs", {
      ...blog,
      url: blog.url || blog.title.toLowerCase().replaceAll(" ", "-"),
      publicAt: blog.public ? Date.now() : undefined,
      listedAt: blog.listed ? Date.now() : undefined,
      updatedAt: Date.now(),
      canSee: blog.canSee ?? [],
      likes: [],
      dislikes: [],
    });

    const [deployment] = await Promise.all([
      ctx.db.insert("deployment", {
        blog: blogId,
        title: blog.title,
        description: blog.content,
        image: blog.image,
        imageAlt: blog.imageAlt,
        default: true,
      }),
      ctx.db.insert("blogEdits", {
        ...blog,
        url: blog.url || blog.title.toLowerCase().replaceAll(" ", "-"),
        public: blog.public ?? false,
        listed: blog.listed ?? false,
        canSee: blog.canSee ?? [],
        blog: blogId,
      }),
    ]);

    await ctx.db.patch(blogId, {
      defaultDeployment: deployment,
    });
  },
});

export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    edit: v.object({
      content: v.optional(v.string()),

      url: v.optional(v.string()),
      public: v.optional(v.boolean()), // Appears on home screen
      listed: v.optional(v.boolean()), // Can be accessed via public url, if false auth required
      canSee: v.optional(v.array(v.id("user"))),
    }),
  },
  handler: async (ctx, { id, edit }) => {
    const [{ auth }, user] = await Promise.all([
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ]);
    if (!user || !auth) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }
    if (
      !(await auth.api.userHasPermission({
        body: {
          userId: user._id,
          permission: {
            blogs: ["update"],
          },
        },
      }))
    ) {
      throw new Error(ERROR_CODES.Unauthorized);
    }
    const publicSet = {
      publicAt:
        edit.public === true
          ? Date.now()
          : edit.public === false
            ? undefined
            : undefined,
    };
    const listedSet = {
      listedAt:
        edit.listed === true
          ? Date.now()
          : edit.listed === false
            ? undefined
            : undefined,
    };
    await Promise.all([
      ctx.db.patch(id, {
        ...edit,
        updatedAt: Date.now(),
        ...(edit.public !== undefined ? publicSet : {}),
        ...(edit.listed !== undefined ? listedSet : {}),
      }),
      ctx.db.insert("blogEdits", {
        ...edit,
        blog: id,
      }),
    ]);
  },
});

export const likeBlog = mutation({
  args: {
    action: v.union(v.literal("like"), v.literal("dislike")),
    blogId: v.id("blogs"),
  },
  handler: async (ctx, { action, blogId }) => {
    const blogPromise = ctx.db.get(blogId);
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }

    const blog = await blogPromise;

    if (!blog) {
      throw new Error(ERROR_CODES.BlogNotFound);
    }

    const patch: PatchValue<DocumentByName<DataModel, "blogs">> = {};

    if (action === "like") {
      if (blog.likes.includes(user._id)) {
        patch.likes = blog.likes.filter((u) => u !== user._id);
      } else {
        patch.dislikes = blog.dislikes.filter((u) => u !== user._id);
        patch.likes = [...blog.likes, user._id];
      }
    } else if (action === "dislike") {
      if (blog.dislikes.includes(user._id)) {
        patch.dislikes = blog.likes.filter((u) => u !== user._id);
      } else {
        patch.likes = blog.dislikes.filter((u) => u !== user._id);
        patch.dislikes = [...blog.likes, user._id];
      }
    }

    await ctx.db.patch(blogId, patch);
  },
});

export const getPublicBlogs = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const blogs = await ctx.db
      .query("blogs")
      .withIndex("public", (q) => q.lte("publicAt", Date.now()))
      .paginate(args.paginationOpts);

    const deployments = await Promise.all(
      blogs.page.map(async (blog) => {
        const deployment = await ctx.db.get(blog.defaultDeployment!);
        return {
          blog,
          deployment: deployment!,
        };
      }),
    );

    return {
      ...blogs,
      page: deployments,
    };
  },
});
