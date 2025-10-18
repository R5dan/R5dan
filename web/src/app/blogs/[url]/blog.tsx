"use client";

import type { Doc } from "convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Blog({
  blog,
  children,
}: {
  blog: Doc<"blogs">;
  children: ReactNode;
}) {
  return (
    <article>
      <header>
        <div>
          <Link href="/blogs">
            <ArrowLeft />
          </Link>
          <div>
            <time>
              Lasted Edited: {new Date(blog.updatedAt).toLocaleDateString()}
            </time>
          </div>
        </div>
        <h1>{blog.title}</h1>
      </header>
      <section>{children}</section>
      <footer></footer>
    </article>
  );
}
