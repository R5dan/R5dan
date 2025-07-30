"use client";

import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
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
    <div className="h-min max-w-[300px] overflow-hidden rounded-lg border-4 border-black bg-white shadow-md dark:border-white dark:bg-black">
      <button
        onClick={() => router.push(`/blogs/${blog.url}`)}
        className="flex h-full w-full flex-col items-center"
      >
        {image ? (
          <div className="relative flex h-[250px] w-[250px] items-center justify-center">
            <Image
              alt="Blog image"
              src={image}
              className="rounded-t-lg object-cover"
              width={250}
              height={250}
            />
            <div className="bg-opacity-60 absolute bottom-2 rounded bg-black px-2 py-1 text-xs text-white">
              {new Date(blog._creationTime).toLocaleDateString()}
            </div>
          </div>
        ) : null}
        <div className="w-full p-3 text-left">
          <h2 className="mb-1 text-lg font-bold">{blog.title}</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            {blog.description}
          </p>
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
