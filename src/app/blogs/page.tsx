"use client";

import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
// import Image from "next/image";

function BlogPreview({
  blog,
  router,
}: {
  blog: Doc<"blogs">;
  router: AppRouterInstance;
}) {
  const image = useQuery(api.blogs.getBlogImage, { id: blog._id });
  return (
    <div className="border-4 border-black dark:border-white">
      <button onClick={() => router.push(`/blogs/${blog.url}`)}>
        {image ? <img alt="Blog image" src={image} /> : <></>}
        <div>
          <h2>{blog.title}</h2>
          <p>{blog.description}</p>
          <p>{new Date(blog._creationTime).toLocaleDateString()}</p>
        </div>
      </button>
    </div>
  );
}

export default function Page() {
  "use client";
  const router = useRouter();
  const { user } = useUser();
  const convexUser = useQuery(api.user.getUserByClerkId, { clerkId: user?.id });
  const blogs = useQuery(api.blogs.getBlogsForUserId, {
    userId: convexUser?._id,
  });

  console.log(blogs);
  if (!blogs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {blogs.map((blog) => (
        <BlogPreview key={blog._id} blog={blog} router={router} />
      ))}
    </div>
  );
}
