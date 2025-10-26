import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote-client/rsc";
import components from "./components";
import { Suspense } from "react";

export function CustomMDXClient(props: Omit<MDXRemoteProps, "components">) {
  return (
    <Suspense fallback={"Loading..."}>
      <MDXRemote {...props} components={components || {}} />;
    </Suspense>
  );
}
