import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { betterAuth } from "better-auth";
import {
	admin,
	apiKey,
	deviceAuthorization,
	twoFactor,
	username,
} from "better-auth/plugins";
import {
	ac,
	admin as adminRole,
	reviewer as reviewerRole,
} from "~/server/auth/permisions";
import { query } from "./_generated/server";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false }
) => {
	return betterAuth({
		// disable logging when createAuth is called just to generate options.
		// this is not required, but there's a lot of noise in logs without it.
		logger: {
			disabled: optionsOnly,
		},
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		// Configure simple, non-verified email/password to get started
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex(),
			username(),
			admin({
				ac,
				roles: {
					admin: adminRole,
					reviewer: reviewerRole,
				} as const,
			}),
			twoFactor(),
			apiKey(),
			deviceAuthorization(),
		],
	});
};

export const getCurrentUser = query({
	handler: async (ctx) => {
		return await authComponent.safeGetAuthUser(ctx);
	},
});
