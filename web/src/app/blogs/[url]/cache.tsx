import { unstable_cacheTag as cacheTag } from "next/cache";
import z from "zod";
import { evaluateMdx } from "~/server/blogs/mdx";
import Blog from "./blog";
import type { Id } from "../../../../convex/_generated/dataModel";
import type { Id as AuthId } from "../../../../convex/betterAuth/_generated/dataModel";

const schema = z.object({
  _id: z.string().transform((v) => v as Id<"blogs">),
  _creationTime: z.number(),
  publicAt: z.number().optional(),
  listedAt: z.number().optional(),
  updatedAt: z.number(),
  image: z
    .string()
    .transform((v) => v as Id<"storage">)
    .optional(),
  title: z.string(),
  content: z.string(),
  description: z.string(),
  url: z.array(z.string()),
  canSee: z.array(z.string().transform((v) => v as AuthId<"user">)),
  likes: z.array(z.string().transform((v) => v as AuthId<"user"> | string)),
  dislikes: z.array(z.string().transform((v) => v as AuthId<"user"> | string)),
});

export default async function CachedPreview({ id }: { id: string }) {
  "use cache";
  const data = schema.parse(await (await fetch(`/api/blog?id=${id}`)).json());
  cacheTag(`BLOG:${data._id}`);
  cacheTag(`BLOG`);
  const { content } = await evaluateMdx(data.content);

  return <Blog blog={data}>{content}</Blog>;
}
