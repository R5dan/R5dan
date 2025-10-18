import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  adminClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { ac, admin, reviewer } from "./permisions";

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
  ],
});
