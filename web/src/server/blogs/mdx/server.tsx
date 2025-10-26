import { evaluate } from "next-mdx-remote-client/rsc";
import components from "./components";

export function evaluateMdx(source: string) {
  return evaluate({
    source,
    components,
  });
}
