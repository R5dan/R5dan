import { CustomMDXClient } from "~/server/blogs/mdx/client";
import Blog from "../[url]/blog";
import type { Id } from "convex/_generated/dataModel";

const blog = `# use directives

## What are directives

Directives allow the developer to add a string to there code to tell the compiler what to do. The most common ones are "use strict", which forces the compiler to use a more modern version of javascript, with various changes to make js more secure.

## Why directives are good

Recently [vercel](vercel.com) announced "use workflow" and "use step". These directives tell the compiler that these are (potentially long running) tasks that should be rerun.

And I like this. They provide a "magic" way to reduce my errors. This does not change the code being executed but instead where or how they are run. I would agree with the criticism of them if they changed the code being executed, but they (currently) don't.

## What directives should do

Directives should describe the code, whether that is its execution location or its caching. But that is all. Nothing else. They should not "magically" change the code, just describe it.

## Why not functions

I don't like the idea of a function resulting in compiler changes. I would say the benefit of directives is that they are not "standard javascript", which helps to separate them from actual code. They distinguish between me calling a process, in the same location and telling a compiler, this code should be treated differently. I think they also help to distinguish for looking at a new codebase. You are a lot less likely to get confused about what some global is.

## Too much of a language feature

This leads to my next point. A lot of people say they are too much like a language feature. And I would agree. But I think it should be a feature and not a bug. These are used by frameworks that are big enough that they control your codebase. If I'm using react, I'm not also having a cli tool in the same source so react sort of becomes the language. JavaScript is a dynamic language that is often manipulated. Svelte contains raw HTML tags in it. That isn't bad, svelte just "becomes" the language, and compiles it before hand to become the executed code.`

export default function Page() {
  return (
    <Blog
      blog={{
        _id: "abc" as Id<"blogs">,
        content: blog,
        url: "use-directives",
        publicAt: 1761445430,
        listedAt: 1761445430,
        canSee: [],
        _creationTime: 1761445430,
        updatedAt: 1761445430,
        likes: [],
        dislikes: [],
      }}
      deployment={{
        _creationTime: 1761445430,
        _id: "abc" as Id<"deployment">,
        blog: "abc" as Id<"blogs">,
        title: "use directives",
        description: "use directives",
        default: true,
      }}
    >
      <CustomMDXClient source={blog} />
    </Blog>
  );
}