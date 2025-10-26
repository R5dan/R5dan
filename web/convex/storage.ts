import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent, createAuth } from "./auth";

const ERROR_CODES = {
  Unauthenticated: "Unauthenticated",
  Unauthorized: "Unauthorized",
};

export const getFileFromId = query({
  args: {
    id: v.id("storage"),
  },
  handler: async (ctx, args) => {
    const promises = [
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ] as const;
    const file = await ctx.db.get(args.id);
    if (!file) {
      throw new Error("File not found");
    }
    if (!file.users) {
      return file;
    }

    const [{ auth }, user] = await Promise.all(promises);
    if (!auth || !user) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }
    if (
      !(
        file.users.includes(user._id) ||
        (await auth.api.userHasPermission({
          body: {
            userId: user._id,
            permission: {
              storage: ["read"],
            },
          },
        }))
      )
    ) {
      throw new Error(ERROR_CODES.Unauthorized);
    }

    return file;
  },
});

export const getFile = query({
  args: {
    fileKey: v.string(),
  },
  handler: async (ctx, args) => {
    const promises = [
      authComponent.getAuth(createAuth, ctx),
      authComponent.safeGetAuthUser(ctx),
    ] as const;
    const file = await ctx.db
      .query("storage")
      .withIndex("fileKey", (q) => q.eq("fileKey", args.fileKey))
      .unique();
    if (!file) {
      throw new Error("File not found");
    }
    if (!file.users) {
      return file;
    }

    const [{ auth }, user] = await Promise.all(promises);
    if (!auth || !user) {
      throw new Error(ERROR_CODES.Unauthenticated);
    }
    if (
      !(
        file.users.includes(user._id) ||
        (await auth.api.userHasPermission({
          body: {
            userId: user._id,
            permission: {
              storage: ["read"],
            },
          },
        }))
      )
    ) {
      throw new Error(ERROR_CODES.Unauthorized);
    }

    return file;
  },
});

export const createFile = mutation({
  args: {
    fileName: v.string(),
    fileKey: v.string(),
    mimeType: v.string(),
    users: v.optional(v.array(v.id("user"))), // Must be defined if not public
  },
  handler: async (ctx, args) => {
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
            storage: ["create"],
          },
        },
      }))
    ) {
      throw new Error(ERROR_CODES.Unauthorized);
    }
    const file = await ctx.db.insert("storage", {
      fileName: args.fileName,
      fileKey: args.fileKey,
      mimeType: args.mimeType,
      users: args.users,
    });
    return file;
  },
});

export const updateFile = mutation({
  args: {
    id: v.id("storage"),
    file: v.object({
      fileKey: v.optional(v.string()),
      fileName: v.optional(v.string()),
      mimeType: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
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
            storage: ["update"],
          },
        },
      }))
    )
      await ctx.db.patch(args.id, args.file);
  },
});

export const deleteFile = mutation({
  args: {
    id: v.id("storage"),
  },
  handler: async (ctx, args) => {
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
            storage: ["delete"],
          },
        },
      }))
    ) {
      throw new Error(ERROR_CODES.Unauthorized);
    }
    await ctx.db.delete(args.id);
  },
});

export const changePublic = mutation({
  args: {
    id: v.id("storage"),
    users: v.optional(v.array(v.id("user"))), // Must be defined if not public
  },
  handler: async (ctx, args) => {
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
            storage: ["update"],
          },
        },
      }))
    ) {
      throw new Error(ERROR_CODES.Unauthorized);
    }

    await ctx.db.patch(args.id, {
      users: args.users,
    });
  },
});
