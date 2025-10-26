"use client";

import { api } from "convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import Preview from "./preview";

export default function Page() {
  const { results, isLoading, status, loadMore } = usePaginatedQuery(
    api.blogs.getPublicBlogs,
    {},
    {
      initialNumItems: 10,
    },
  );

  return (
    <div>
      <div>
        <h1>Blogs</h1>
      </div>
      <div>
        <ul>
          {results.map(({ blog, deployment }) => (
            <Preview deployment={deployment} url={blog.url} key={blog._id} />
          ))}
        </ul>
      </div>
    </div>
  );
}
