"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Highlighter } from "~/server/highlighter";
import { useTheme } from "~/server/theme";
import { useUser } from "@clerk/clerk-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div
          className="text-center text-lg"
          style={{ color: theme === "dark" ? "#8b949e" : "#656d76" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  const sizes = {
    xs: "xl",
    sm: "2xl",
    md: "4xl",
    lg: "6xl",
    xl: "9xl",
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1
          className={`leading-tight font-bold`}
          style={{
            fontSize:
              sizes[size] === "xl"
                ? "3rem"
                : sizes[size] === "lg"
                  ? "2.5rem"
                  : sizes[size] === "md"
                    ? "2rem"
                    : sizes[size] === "sm"
                      ? "1.5rem"
                      : "1.25rem",
          }}
        >
          {data.title}
        </h1>
        <div className="flex items-center gap-3">
          <label
            htmlFor="size-select"
            className="text-sm font-medium"
            style={{ color: theme === "dark" ? "#8b949e" : "#656d76" }}
          >
            Text Size:
          </label>
          <Select
            defaultValue="md"
            value={size}
            onValueChange={(value) => {
              // @ts-expect-error value is correct
              setSize(value);
            }}
          >
            <SelectTrigger className="w-24" id="size-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">Extra Small</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        className="prose prose-lg max-w-none"
        style={{ color: theme === "dark" ? "#c9d1d9" : "#24292e" }}
      >
        <Highlighter markdown={data.content} theme={theme} size={size} />
      </div>
    </div>
  );
}
