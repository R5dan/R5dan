import { InferUITools, UIMessage, UIDataTypes } from "ai";
import type { MyUITools } from "./tools";

export type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;
