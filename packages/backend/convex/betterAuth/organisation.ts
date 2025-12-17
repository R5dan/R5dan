import { query } from "./_generated/server";
import { v } from "convex/values";
import { tables } from "./generatedSchema";

function table<N extends keyof typeof tables>(name: N) {
  return tables[name]["validator"];
}

export const getUsersOwnedOrganisation = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(table("member")),
  handler: async (ctx, args) => {
    const orgs = await ctx.db
      .query("member")
      .withIndex("role_user", (q) =>
        q.eq("role", "owner").eq("userId", args.userId),
      )
      .collect();
    return orgs;
  },
});
