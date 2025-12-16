import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { betterAuth } from "better-auth";
import { apiKey, admin as adminPlugin, organization } from "better-auth/plugins";
import authSchema from "./betterAuth/schema"; 
// import { z } from "zod";

type tier = "free" | "pro" | "admin";

const limits = {
	free: {
		organization: 1,
	},
	pro: {
		organization: 10,
	},
	admin: {
		organization: Infinity,
	},
} as {
	[key in tier]: {
		organization: number;
	};
};

const siteUrl = process.env.SITE_URL!;

// @ts-ignore
export const authComponent = createClient<DataModel, typeof authSchema>(
	components.betterAuth,
	{
		local: {
			schema: authSchema,
		},
	}
);

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    baseUrl: siteUrl,
    database: authComponent.adapter(ctx),
		trustedOrigins: [process.env.CORS_ORIGIN || ""],
		emailAndPassword: {
			enabled: true,
		},
    logger: {
      disabled: optionsOnly,
    },
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
    },
    user: {
      additionalFields: {
        tier: {
          type: "string",
          defaultValue: "free",
          // validator: {
          //   input: z.enum(["free", "pro", "admin"]),
          //   output: z.enum(["free", "pro", "admin"])
          // }
        }
      }
    },
		plugins: [
			convex(),
			apiKey({
				defaultPrefix: "revents_",
			}),
			adminPlugin(),
      organization(),
		],
	});
};
