import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import Blog from "./blog";
import { CustomMDX } from "~/server/blogs/mdx";
import { notFound } from "next/navigation";

export default function Client({ id }: { id: Id<"blogs"> }) {
  const data = useQuery(api.blogs.getBlogById, { id });

  if (!data) {
    return notFound();
  }

  return (
    <Blog blog={data}>
      <CustomMDX source={data.content} />
    </Blog>
  );
}
