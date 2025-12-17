import { ConvexClient } from "convex/browser";

export * from "./src";
export const convex = new ConvexClient(process.env.CONVEX_URL!);
