"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import env from "~/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
