import { PropertyValidators, Validator } from "convex/values";
import { query } from "./_generated/server";
import { ArgsArrayForOptionalValidator, ArgsArrayToObject, DefaultArgsForOptionalValidator, GenericQueryCtx, RegisteredQuery, ReturnValueForOptionalValidator } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { Session, User } from "better-auth";
import { authComponent, createAuth } from "./auth";

export type AuthQueryBuilder = {
	<
		ArgsValidator extends
			| PropertyValidators
			| Validator<any, "required", any>
			| void,
		ReturnsValidator extends
			| PropertyValidators
			| Validator<any, "required", any>
			| void,
		ReturnValue extends ReturnValueForOptionalValidator<ReturnsValidator> = any,
		OneOrZeroArgs extends ArgsArrayForOptionalValidator<ArgsValidator> = DefaultArgsForOptionalValidator<ArgsValidator>
	>(
		query:
			| {
					/**
					 * Argument validation.
					 *
					 * Examples:
					 *
					 * ```
					 * args: {}
					 * args: { input: v.optional(v.number()) }
					 * args: { message: v.string(), author: v.id("authors") }
					 * args: { messages: v.array(v.string()) }
					 * ```
					 */
					args?: ArgsValidator;
					/**
					 * The return value validator.
					 *
					 * Examples:
					 *
					 * ```
					 * returns: v.null()
					 * returns: v.string()
					 * returns: { message: v.string(), author: v.id("authors") }
					 * returns: v.array(v.string())
					 * ```
					 */
					returns?: ReturnsValidator;
					/**
					 * The implementation of this function.
					 *
					 * This is a function that takes in the appropriate context and arguments
					 * and produces some result.
					 *
					 * @param ctx - The context object. This is one of {@link QueryCtx},
					 * {@link MutationCtx}, or {@link ActionCtx} depending on the function type.
					 * @param args - The arguments object for this function. This will match
					 * the type defined by the argument validator if provided.
					 * @returns
					 */
					handler: (
            ctx: GenericQueryCtx<DataModel>,
            session: NonNullable<Awaited<ReturnType<Awaited<ReturnType<typeof authComponent.getAuth>>["auth"]["api"]["getSession"]>>>,
            auth: Awaited<ReturnType<typeof authComponent.getAuth>>,
            ...args: OneOrZeroArgs
					) => ReturnValue;
			  }
	): RegisteredQuery<
		"public",
		ArgsArrayToObject<OneOrZeroArgs>,
		ReturnValue
	>;
};

export const authQuery = ((data) => {
  return query({
    ...data,
    // @ts-ignore
    handler: async (ctx, ...args) => {
      // @ts-ignore
      const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
      const session = await auth.api.getSession({ headers });

      if (!session) {
        throw new Error("No session");
      }

      return data.handler(ctx, session, {auth, headers}, ...args)
    }
  })
}) satisfies AuthQueryBuilder
