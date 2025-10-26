"use cache";

import { api } from "convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import CachedPreview from "./cache";
import { Suspense } from "react";
import Client from "./client";
import { CodeGroupContext } from "~/components/code-group";

export async function Page({ params }: { params: Promise<{ url: string }> }) {
  const { url } = await params;
  //const { d } = searchParamsSchema.parse(await searchParams);
  const d = undefined;
  let defaultDeployment;
  if (!d) {
    defaultDeployment = await fetchQuery(api.blogs.getDefaultDeploymentByUrl, {
      url,
    });
  }
  const { blog, deployment } = await fetchQuery(
    api.blogs.getBlogDeploymentByUrl,
    {
      id: (d || defaultDeployment)!,
      blog: url,
    },
  );

  return (
    <CodeGroupContext>
      <Suspense
        fallback={<CachedPreview blog={blog} deployment={deployment} />}
      >
        <Client blogId={blog._id} deploymentId={deployment._id} />
      </Suspense>
    </CodeGroupContext>
  );
}
