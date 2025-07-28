"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState, useEffect } from "react";
import HLJS from "react-syntax-highlighter";
import dark from "./dark";
import light from "./light";
import {
  Clipboard,
  ClipboardCheck,
} from "lucide-react";


function Copy({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copying">("idle");

  useEffect(() => {
    async function handleCopy() {
      if (state === "copying") {
        await navigator.clipboard.writeText(text);
        setTimeout(() => setState("idle"), 1000);
      }
    }
    handleCopy();
  }, [state, text]);

  if (state === "idle") {
    return (
      <button
        onClick={() => {
          setState("copying");
        }}
        className="hover:scale-110"
      >
        <Clipboard className="h-5 w-5" />
      </button>
    );
  } else if (state === "copying") {
    return (
      <button className="hover:scale-110">
        <ClipboardCheck className="h-5 w-5" />
      </button>
    );
  }
}

// function WrapLines({
//   setWrap,
//   wrap,
// }: {
//   setWrap: React.Dispatch<React.SetStateAction<boolean>>;
//   wrap: boolean;
// }) {
//   if (wrap) {
//     return (
//       <button onClick={() => setWrap(false)} className="hover:scale-110">
//         <AlignLeft className="h-5 w-5" />
//       </button>
//     );
//   } else {
//     return (
//       <button onClick={() => setWrap(true)} className="hover:scale-110">
//         <WrapText className="h-5 w-5" />
//       </button>
//     );
//   }
// }

export function Highlighter({
  markdown,
  theme,
  size = "md",
}: {
  markdown: string;
  theme: "dark" | "light";
  size: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p({ children }) {
          const sizes = {
            xs: "xs",
            sm: "sm",
            md: "base",
            lg: "lg",
            xl: "xl",
          };
          const className = `my-5 text-${sizes[size]}`;
          return <p className={className}>{children}</p>;
        },
        h1({ children }) {
          const sizes = {
            xs: "lg",
            sm: "xl",
            md: "2xl",
            lg: "5xl",
            xl: "9xl",
          };
          const className = `my-5 text-${sizes[size]}`;

          return <h1 className={className}>{children}</h1>;
        },
        h2({ children }) {
          const sizes = {
            xs: "base",
            sm: "lg",
            md: "xl",
            lg: "3xl",
            xl: "6xl",
          };
          const className = `my-5 text-${sizes[size]} underline-offset-2 underline font-bold`;

          return <h2 className={className}>{children}</h2>;
        },
        h3({ children }) {
          const sizes = {
            xs: "sm",
            sm: "base",
            md: "lg",
            lg: "xl",
            xl: "3xl",
          };
          const className = `my-5 text-${sizes[size]} font-bold`;

          return <h3 className={className}>{children}</h3>;
        },
        h4({ children }) {
          const sizes = {
            xs: "xs",
            sm: "sm",
            md: "base",
            lg: "lg",
            xl: "xl",
          };
          const className = `text-${sizes[size]} my-5 font-bold"`;

          return <h4 className={className}>{children}</h4>;
        },
        // @ts-expect-error inline is a valid prop
        code({ inline, className, children, ...props }) {
          const themeObj = theme === "dark" ? dark : light;
          const match = /language-(\w+)/.exec(className ?? "");
          const lang = match ? match[1]! : ("plaintext" as const);
          const lines = String(children).split("\n")
          const l1 = lines.length > 1 && lines[0] ? lines[0] : ""
          const regex = new RegExp("// (.*) \\\\")
          const file = regex.exec(l1)?.[1] ?? ""
          let text
          if (file) {
            text = lines.slice(1).join("\n").replace(/\n$/, "");
          }
          else {
            text = String(children).replace(/\n$/, "");
          }

          return !inline && match ? (
            <div
              className="my-5 rounded-lg border-8 border-gray-900"
              style={{ backgroundColor: "var(--color-gray-900)" }}
            >
              <div
                className="text-s center flex justify-between rounded-t-md border-8 text-gray-500"
                style={{
                  borderColor: "#1f2938",
                  backgroundColor: "#1f2938",
                }}
              >
                <div className="flex justify-between gap-5">
                <span className="my-auto text-center font-mono">{lang}</span>
                <span className="font-mono text-center">{file}</span>
                </div>
                  <div className="flex justify-between gap-5">
                  {/* <WrapLines setWrap={setWrap} wrap={wrap} /> */}
                  <Copy text={String(children).replace(/\n$/, "")} />
                </div>
              </div>
              <div
                className="rounded-b-md border-8"
                style={{ borderColor: themeObj.hljs.background }}
              >
                <HLJS
                  style={themeObj}
                  language={lang}
                  PreTag="div"
                  className="overflow-x-auto"
                  showLineNumbers
                  lineNumberContainerStyle={{
                    "padding-right": "10px",
                    "padding-color": "#030712",
                  }}
                  {...props}
                >
                  {text}
                </HLJS>
              </div>
            </div>
          ) : (
            <code className={className} {...props}>
              {text}
            </code>
          );
        },
        ol({ className, children, ...props }) {
          return (
            <ol className={`list-decimal p-5 ${className}`} {...props}>
              {children}
            </ol>
          );
        },
        ul({ className, children, ...props }) {
          return (
            <ul className={`list-disc p-5 ${className}`} {...props}>
              {children}
            </ul>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
