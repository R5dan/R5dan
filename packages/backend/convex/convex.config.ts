import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";
import todo from "./todo/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(todo);

export default app;
