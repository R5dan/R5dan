"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { CustomMDXClient as CustomMDX } from "~/server/blogs/mdx/client";
import Blog from "./blog";

export default function Client({
  deploymentId,
  blogId,
}: {
  blogId: Id<"blogs">;
  deploymentId: Id<"deployment">;
}) {
  const data = useQuery(api.blogs.getBlogDeploymentById, {
    id: deploymentId,
    blog: blogId,
  });
  if (!data) {
    return;
  }
  const { blog, deployment } = data;
  return (
    <Blog blog={blog} deployment={deployment}>
      <CustomMDX source={blog.content} />
    </Blog>
  );
}
