import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  adminClient,
  twoFactorClient,
  apiKeyClient,
} from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { ac, admin, reviewer } from "./permisions";
import { deviceAuthorizationClient } from "better-auth/plugins";

export const authClient = createAuthClient({
  plugins: [
    convexClient(),
    usernameClient(),
    adminClient({
      ac,
      roles: {
        admin,
        reviewer,
      },
    }),
    twoFactorClient(),
    apiKeyClient(),
    deviceAuthorizationClient(),
  ],
});

export const { signIn, signUp } = authClient;
