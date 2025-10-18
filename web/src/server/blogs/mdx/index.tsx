import {
  MDXRemote,
  type MDXRemoteProps,
  evaluate,
} from "next-mdx-remote-client/rsc";
import components from "./components";

export function CustomMDX(props: Omit<MDXRemoteProps, "components">) {
  return <MDXRemote {...props} components={components || {}} />;
}

export function evaluateMdx(source: string) {
  return evaluate({
    source,
    components,
  });
}
