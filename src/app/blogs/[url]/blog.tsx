"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Highlighter } from "~/server/highlighter";
import { useTheme } from "~/server/theme";
import { useUser } from "@clerk/clerk-react";
import { Select, SelectContent, SelectItem } from "~/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";

export default function Blog({ url }: { url: string }) {
  console.log("URL", url);
  const { user: clerkUser } = useUser();
  const user = useQuery(api.user.getUserByClerkId, { clerkId: clerkUser?.id });
  const data = useQuery(api.blogs.getBlogByURL, {
    url,
    userId: user?._id ?? undefined,
  });
  const [theme] = useTheme("dark");
  const [size, setSize] = useState<"md" | "xs" | "sm" | "lg" | "xl">("md");

  if (!data) {
    return <div>Loading...</div>;
  }

  const sizes = {
    xs: "xl",
    sm: "2xl",
    md: "4xl",
    lg: "6xl",
    xl: "9xl",
  };

  return (
    <div className="m-30">
      <div>
        <h1 className={`my-5 text-${sizes[size]} font-bold`}>{data.title}</h1>
        <Select
          defaultValue="md"
          value={size}
          onValueChange={(value) => {
            // @ts-expect-error value is correct
            setSize(value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">xs</SelectItem>
            <SelectItem value="sm">sm</SelectItem>
            <SelectItem value="md">md</SelectItem>
            <SelectItem value="lg">lg</SelectItem>
            <SelectItem value="xl">xl</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Highlighter markdown={data.content} theme={theme} size={size} />;
    </div>
  );
}
