import { query, mutation } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

export const listTodos = query({
  args: {
    paginationOtps: paginationOptsValidator,
  },
  handler: async () => {}
})