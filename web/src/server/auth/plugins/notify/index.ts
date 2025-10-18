import { createEndpoint, type BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, createAuthMiddleware } from "better-auth/plugins";
import { z } from "zod";

type Options = {
  sendEmail?: (data: {
    email: string[];
    subject: string;
    body: string;
  }) => Promise<void>;
};

export function notifyPlugin(options: Options) {
  return {
    id: "notify",
    schema: {
      user: {
        fields: {
          notify: {
            type: "boolean",
            required: true,
            defaultValue: false,
          },
        },
      },
    },
    endpoints: {
      notify: createAuthEndpoint(
        "/notify",
        {
          method: "POST",
          body: z.object({
            subject: z.string(),
            body: z.string(),
          }),
        },
        async (ctx) => {
          const users = await ctx.context.adapter.findMany({
            model: "user",
            where: [
              {
                field: "notify",
                operator: "eq",
                value: true,
              },
            ],
          });

          await options.sendEmail?.({
            email: users.map((u) => u.email),
            subject: ctx.body.subject,
            body: ctx.body.body,
          });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
}
