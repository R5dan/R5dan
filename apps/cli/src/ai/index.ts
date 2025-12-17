import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openRouter = createOpenRouter({
  apiKey:
    "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",
});

export { tools, type MyUITools } from "./tools";
export { MyUIMessage } from "./types";
