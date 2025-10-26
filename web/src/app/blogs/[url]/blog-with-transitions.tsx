"use client";

import type { Doc } from "convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogWithTransitions({
  blog,
  deployment,
  children,
}: {
  blog: Doc<"blogs">;
  deployment: Doc<"deployment">;
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
        {/* <ViewTransition name={viewTransitions.BLOG.TITLE(blog._id)}>
          <h1>{deployment.title}</h1>
        </ViewTransition> */}
        <section>
          {/* <ViewTransition name={viewTransitions.BLOG.DESCRIPTION(blog._id)}>
            <p>{deployment.description}</p>
          </ViewTransition> */}
        </section>
        {/*<ViewTransition name={viewTransitions.BLOG.IMAGE(blog._id)}>
          {deployment.image ? (
            <Image src={deployment.image} alt={deployment.imageAlt!} />
          ) : (
            <></>
          )}
        </ViewTransition>*/}
      </header>
      <section>{children}</section>
      <footer></footer>
    </article>
  );
}
