import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  deleteRedirect,
  getAllRedirects,
  getNextID,
  getRedirect,
  setRedirect,
} from "~/server/upstash/redis";
import { TRPCError } from "@trpc/server";

export const redirectRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const url = await getRedirect(input.id);
      if (url.isErr()) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: url.error.message,
        });
      }
      return url.value;
    }),

  set: publicProcedure
    .input(z.object({ id: z.string(), url: z.string() }))
    .mutation(async ({ input }) => {
      const url = await setRedirect(input.id, input.url);
      if (url.isErr()) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return url.value;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const url = await deleteRedirect(input.id);
      if (url.isErr()) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return url.value;
    }),

  getAll: publicProcedure.query(async () => {
    const urls = await getAllRedirects();
    if (urls.isErr()) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    return urls.value;
  }),

  getNextID: publicProcedure.query(async () => {
    const id = await getNextID();
    if (id.isErr()) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    return id.value;
  })
},
);
