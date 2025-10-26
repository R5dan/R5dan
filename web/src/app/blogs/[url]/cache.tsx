"use cache";

import { cacheTag } from "next/cache";
import Blog from "./blog";
import type { Doc } from "../../../../../convex/_generated/dataModel";

export default async function CachedPreview({
  blog,
  deployment,
}: {
  blog: Doc<"blogs">;
  deployment: Doc<"deployment">;
}) {
  cacheTag(`BLOG:${blog._id}:${deployment._id}`, `BLOG:${blog._id}`, `BLOG`);

  return (
    <Blog blog={blog} deployment={deployment}>
      {null}
    </Blog>
  );
}
