import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import type { NextRequest } from "next/server";
import z from "zod";
import { getToken } from "~/server/auth/utils";

async function parseAsync<R>(schema: z.ZodType<R>, data: Promise<unknown>) {
  return await schema.parseAsync(await data);
}

const patchSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  remindAt: z
    .array(
      z.object({
        t: z.number(),
        d: z.boolean(),
      }),
    )
    .optional(),
  priority: z.coerce.bigint().optional(),
});

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/todo/[id]">,
) {
  const [{ id }, token] = await Promise.all([ctx.params, getToken()]);
  const todo = await fetchQuery(
    api.todos.getTodo,
    {
      id: id as Id<"todo">,
    },
    {
      token,
    },
  );

  if (!todo) {
    return Response.json(
      {
        status: false,
        data: null,
      },
      {
        status: 404,
      },
    );
  }
  return Response.json({
    status: true,
    data: todo,
  });
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/todo/[id]">,
) {
  const [{ id }, token, edit] = await Promise.all([
    ctx.params,
    getToken(),
    parseAsync(patchSchema, req.json()),
  ]);

  await fetchMutation(
    api.todos.updateTodo,
    {
      ...edit,
      id: id as Id<"todo">,
    },
    {
      token,
    },
  );

  return Response.json({
    status: true,
  });
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<"/api/todo/[id]">,
) {
  const [{ id }, token] = await Promise.all([ctx.params, getToken()]);

  await fetchMutation(
    api.todos.deleteTodo,
    {
      id: id as Id<"todo">,
    },
    {
      token,
    },
  );

  return Response.json({
    status: true,
  });
}
