import type { Doc } from "convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { Image } from "@imagekit/next";

export default function Blog({
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
        <h1>{deployment.title}</h1>
        <section>
          <p>{deployment.description}</p>
        </section>
        {deployment.image ? (
          <Image src={deployment.image} alt={deployment.imageAlt!} />
        ) : (
          <></>
        )}
      </header>
      <section>{children}</section>
      <footer></footer>
    </article>
  );
}
