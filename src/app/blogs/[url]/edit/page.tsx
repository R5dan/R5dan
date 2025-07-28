"use client";

import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import Edit from "~/components/edit";
import { use, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { fetchQuery } from "convex/nextjs";
import { useUser } from "@clerk/nextjs";


export default function Page({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  const { url } = use(params);
  const {user} = useUser();
  const convexUser = useQuery(api.user.getUserByClerkId, {clerkId: user?.id});
  const data = useQuery(api.blogs.getBlogByURL, {url, userId: convexUser?._id});
  const editBlog = useMutation(api.blogs.updateBlog);
  const generateImageUrl = useMutation(api.blogs.uploadImage);
  const updateBlogImage = useMutation(api.blogs.updateBlogImage);
  const imageURL = useQuery(api.blogs.getBlogImage, { id: data?._id });
  
  if (!data) {
    return <div>Loading</div>;
  }

  async function onSave(
    title: string,
    content: string,
    description: string,
    isPublic: boolean,
    listed: boolean,
  ) {
    await editBlog({
      id: data!._id,
      title,
      content,
      description,
      listed,
      isPublic,
    });
  }

  console.log("EDIT: ", Edit)

  return (
    <Edit
      data={{...data, image: imageURL}}
      onSave={onSave}
      onImageChange={async (image) => {
        if (!image) {
          return null;
        }
        const url = await generateImageUrl();
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        const { storageId } = await res.json() as {storageId: Id<"_storage">}
        await updateBlogImage({ id: data._id, image: storageId });
        const fileUrl = await fetchQuery(api.blogs.getBlogImage, {
          id: data._id,
        });
        return fileUrl
      }}
    />
  );
}
