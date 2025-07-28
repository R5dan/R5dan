"use client";

import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Edit from "~/components/edit";
import { fetchQuery } from "convex/nextjs";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function Page() {
  const createBlog = useMutation(api.blogs.createBlog);
  const generateImageUrl = useMutation(api.blogs.uploadImage);
  const [image, setImage] = useState<File | null>(null);

  async function onSave(
    title: string,
    content: string,
    description: string,
    isPublic: boolean,
    listed: boolean,
  ) {
      const url = await generateImageUrl();
      const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image?.type ?? "image/png" },
          body: image,
        });
    const { storageId } = await res.json() as {storageId: Id<"_storage">}

    await createBlog({
      title,
      content,
      description,
      public: isPublic,
      listed,
      image: storageId,
    });
  }

  return (
    <Edit
      onSave={onSave}
      onImageChange={async (image) => {
        setImage(image);
        return URL.createObjectURL(image);
      }}
    />
  );
}
