// app/providers.tsx
"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import SuspendedPostHogPageView from "./pageView";
import env from "web/src/env";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      {children}
      <SuspendedPostHogPageView />
    </PHProvider>
  );
}
