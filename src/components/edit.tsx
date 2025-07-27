"use client";

import { useUser } from "@clerk/nextjs";
import { useTheme } from "~/server/theme";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { Highlighter } from "~/server/highlighter";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import FileInput from "./input";

function useSwitch(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue((v) => !v);
  const set = (v: boolean) => setValue(v);
  return [value, toggle, set] as const;
}

export default function Edit({
  onSave,
  onImageChange,
  data,
}: {
  onSave: (
    title: string,
    content: string,
    description: string,
    isPublic: boolean,
    listed: boolean,
  ) => Promise<void>;
  onImageChange: (image: File | null) => Promise<string | null>;
  data?: {
    title?: string;
    content?: string;
    description?: string;
    public?: boolean;
    listed?: boolean;
    image?: string | null;
  };
}) {
  const router = useRouter();

  const [theme] = useTheme("dark");
  const [publicValue, , setPublic] = useSwitch(data?.public ?? false);
  const [listedValue, , setListed] = useSwitch(data?.listed ?? false);
  const [title, setTitle] = useState(data?.title ?? "");
  const [description, setDescription] = useState(data?.description ?? "");
  const [content, setContent] = useState(data?.content ?? "");
  const [image, setImage] = useState<string | null>(data?.image ?? null);
  const { user, isLoaded: userLoaded } = useUser();
  const convexUser = useQuery(
    api.user.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip",
  );

  // Loading and error handling
  if (!userLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading User...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        You must be signed in to create a blog.
      </div>
    );
  }

  if (convexUser === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Convex user...
      </div>
    );
  }

  if (convexUser === null || convexUser instanceof Error) {
    return (
      <div className="flex h-screen items-center justify-center">
        User not found or error loading user.
      </div>
    );
  }

  if (!convexUser.admin) {
    router.push("/blogs");
    return;
  }

  async function handleSave() {
    await onSave(title, content, description, publicValue, listedValue);
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 py-8 dark:bg-black">
      <form onSubmit={handleSave}>
        {/* Sticky Title/Settings Bar */}
        <div className="sticky top-16 z-20 flex w-full flex-row items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
          {/* Title Input */}
          <div className="min-w-0 flex-1">
            <label className="mb-1 block text-sm font-medium" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="h-15 w-full border-none bg-transparent text-3xl font-bold shadow-none focus:ring-0 focus:outline-none"
            />
          </div>
          {/* Settings & Save */}
          <div className="ml-8 flex flex-row items-center gap-8">
            <div className="flex flex-col items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={publicValue} onCheckedChange={setPublic} />
                Public
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={listedValue} onCheckedChange={setListed} />
                Listed
              </label>
            </div>
            <Button onClick={handleSave} className="px-6 py-2 font-semibold">
              Save Blog
            </Button>
          </div>
        </div>
        {/* Main Content */}
        <div className="mt-8 w-full flex-1 px-8 py-20 block">
          <div className="flex w-full justify-center">
            <FileInput
              handleFile={async (file) => {
                setImage(await onImageChange(file));
              }}
            >
              <div
                className="relative my-6 flex aspect-video w-full max-w-2xl items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-md dark:bg-gray-900"
              >
                {image ? (
                  <Image
                    src={image}
                    alt="Blog Image"
                    fill
                    style={{ objectFit: "cover" }}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-400 select-none dark:bg-gray-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-2 h-12 w-12 opacity-40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 0l-4.5 6-3-4L5 17"
                      />
                    </svg>
                    <span className="text-lg font-medium opacity-60">
                      No Image Selected
                    </span>
                  </div>
                )}
              </div>
            </FileInput>
          </div>
          <div className="mb-4">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="description"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short summary of your blog post"
              className="min-h-[60px] w-full"
            />
          </div>
          <label className="mb-1 block text-sm font-medium" htmlFor="content">
            Content
          </label>
          <Tabs defaultValue="edit" className="h-full w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="h-full">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post here..."
                className="h-full min-h-[200px] w-full text-xl"
              />
            </TabsContent>
            <TabsContent value="preview" className="h-full">
              <Highlighter markdown={content} theme={theme} size="md" />
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </div>
  );
}
