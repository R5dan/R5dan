import { authQuery } from "./_utils"
import { components } from "./_generated/api";
import { v } from "convex/values";

type tier = "free"| "pro"| "admin"

const limits = {
  free: {
    organization: 1
  },
  pro: {
    organization: 10
  },
  admin: {
    organization: Infinity
  }
} as {
  [key in tier]: { 
    organization: number
  }
}

export const createOrganization = authQuery({
  args: {
    slug: v.string(),
    name: v.string(),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, session, { auth, headers }, args) => {
    const user = session.user;
    // @ts-ignore
    const limit = limits[user["tier"] as tier ?? "free"]["organization"];

    if (limit !== Infinity) {
      const orgs = await ctx.runQuery(components.betterAuth.organisation.getUsersOwnedOrganisation, {
        userId: session.user.id
      })

      if (orgs.length >= limit) {
        throw new Error("You have reached the limit of organizations")
      }
    }

    // @ts-ignore
    const org = await auth.api.createOrganization({
		body: {
			name: args.name,
			slug: args.slug,
			logo: args.logo,
			userId: user.id,
			keepCurrentActiveOrganization: false,
		},
		headers,
	});

    return org;
  }
})