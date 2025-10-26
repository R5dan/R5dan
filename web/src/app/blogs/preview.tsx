"use client";

import { Image } from "@imagekit/next";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ViewTransition } from "react";
import { getFileUrl } from "~/server/uploadthing";
import viewTransitions from "~/server/viewTransitions";

export default function Preview({
  deployment,
  url,
}: {
  deployment: Doc<"deployment">;
  url: string;
}) {
  const image = useQuery(
    api.storage.getFileFromId,
    deployment.image ? { id: deployment.image } : "skip",
  );

  return (
    <a href={`/blogs/${url}`}>
      <div>
        <ViewTransition name={viewTransitions.BLOG.IMAGE(deployment.blog)}>
          {image?.fileKey ? (
            <Image
              src={getFileUrl(image.fileKey)}
              alt={deployment.imageAlt ?? ""}
            />
          ) : (
            <></>
          )}
        </ViewTransition>
      </div>
      <div>
        <ViewTransition name={viewTransitions.BLOG.TITLE(deployment.blog)}>
          <h1>{deployment.title}</h1>
        </ViewTransition>
        <ViewTransition
          name={viewTransitions.BLOG.DESCRIPTION(deployment.blog)}
        >
          <p>{deployment.description}</p>
        </ViewTransition>
      </div>
    </a>
  );
}
