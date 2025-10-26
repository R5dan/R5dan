"use cache";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import z from "zod";
import CachedPreview from "./cache";
import { Suspense } from "react";
import Client from "./client";
import { CodeGroupContext } from "~/components/code-group";

const searchParamsSchema = z.object({
  d: z
    .string()
    .transform((v) => v as Id<"deployment">)
    .optional(),
});

export default async function Wrapper({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  return (
    <Suspense fallback={"Loading..."}>
      <Page params={params} />
    </Suspense>
  );
}

async function Page({ params }: { params: Promise<{ url: string }> }) {
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
