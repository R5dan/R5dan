// import {} from "../convex/_generated"
export { redis } from "./redis";

import { ConvexClient } from "convex/browser";

export const convex = new ConvexClient(process.env.CONVEX_URL!);
