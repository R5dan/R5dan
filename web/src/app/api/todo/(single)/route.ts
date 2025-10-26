import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";
import type { NextRequest } from "next/server";
import z from "zod";
import { getToken } from "~/server/auth/utils";

async function parseAsync<R>(schema: z.ZodType<R>, data: Promise<unknown>) {
  return await schema.parseAsync(await data);
}

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  description: z.string(),
  remindAt: z.array(
    z.object({
      t: z.number(),
      d: z.boolean(),
    }),
  ),
  priority: z.coerce.bigint(),
});

export async function POST(req: NextRequest) {
  const [token, todo] = await Promise.all([
    getToken(),
    parseAsync(postSchema, req.json()),

  ]);

  const id = await fetchMutation(api.todos.createTodo, todo, {
    token,
  });

  return Response.json({
    status: true,
    data: id,
  });
}
