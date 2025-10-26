import type { Id as AuthId } from "../../../../convex/betterAuth/_generated/dataModel";
import type { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  description: z.string(),

  url: z.string().optional(),
  public: z.boolean().optional(), // Appears on home screen
  listed: z.boolean().optional(), // Can be accessed zia public url, if false auth required
  canSee: z.array(z.string().transform((v) => v as AuthId<"user">)).optional(),
  image: z
    .string()
    .transform((v) => v as Id<"storage">)
    .optional(),
});

const patchSchema = z.object({
  id: z.string().transform((v) => v as Id<"blogs">),

  content: z.string().optional(),
  url: z.string().optional(),
  public: z.boolean().optional(), // Appears on home screen
  listed: z.boolean().optional(), // Can be accessed zia public url, if false auth required
  canSee: z.array(z.string().transform((v) => v as AuthId<"user">)).optional(),
});

export function POST(req: NextRequest) {
  const blog = postSchema.parse(req.json());

  return Response.json({
    data: fetchMutation(api.blogs.addBlog, {
      blog,
    }),
  });
}

export function PATCH(req: NextRequest) {
  const { id, ...blog } = patchSchema.parse(req.json());

  revalidateTag(`BLOG:${id}`, "yearly");

  return Response.json({
    data: fetchMutation(api.blogs.updateBlog, {
      id,
      edit: blog,
    }),
  });
}
