"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState, useEffect } from "react";
import HLJS from "react-syntax-highlighter";
import dark from "./dark";
import light from "./light";
import { Clipboard, ClipboardCheck } from "lucide-react";

function Copy({ text, theme }: { text: string; theme: "dark" | "light" }) {
  const [state, setState] = useState<"idle" | "copying">("idle");

  useEffect(() => {
    async function handleCopy() {
      if (state === "copying") {
        await navigator.clipboard.writeText(text);
        setTimeout(() => setState("idle"), 1000);
      }
    }
    void handleCopy();
  }, [state, text]);

  if (state === "idle") {
    return (
      <button
        onClick={() => {
          setState("copying");
        }}
        className="rounded p-1 transition-transform duration-200 hover:scale-110"
        style={{
          color: theme === "dark" ? "#8b949e" : "#656d76",
        }}
      >
        <Clipboard className="h-4 w-4" />
      </button>
    );
  } else if (state === "copying") {
    return (
      <button
        className="rounded p-1 transition-transform duration-200 hover:scale-110"
        style={{
          color: theme === "dark" ? "#7ee787" : "#22863a",
        }}
      >
        <ClipboardCheck className="h-4 w-4" />
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
        code({
          inline,
          className,
          children,
          ...props
        }: {
          inline: boolean;
          className: string;
          children: string;
          props: Omit<
            React.HTMLAttributes<HTMLElement>,
            "className" | "children"
          >;
        }) {
          const themeObj = theme === "dark" ? dark : light;
          const match = /language-(\w+)/.exec(className ?? "");
          const lang = match ? match[1] : ("plaintext" as const);
          const lines = String(children).split("\n");
          const l1 = lines.length > 1 && lines[0] ? lines[0] : "";
          const regex = new RegExp("// (.*) \\\\");
          const file = regex.exec(l1)?.[1] ?? "";
          let text;
          if (file) {
            text = lines.slice(1).join("\n").replace(/\n$/, "");
          } else {
            text = String(children).replace(/\n$/, "");
          }

          return !inline && match ? (
            <div
              className="my-5 overflow-hidden rounded-lg border shadow-sm"
              style={{
                backgroundColor: theme === "dark" ? "#0d1117" : "#ffffff",
                borderColor: theme === "dark" ? "#30363d" : "#d0d7de",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-2 text-sm"
                style={{
                  backgroundColor: theme === "dark" ? "#21262d" : "#f6f8fa",
                  borderBottom: `1px solid ${theme === "dark" ? "#30363d" : "#d0d7de"}`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: theme === "dark" ? "#8b949e" : "#656d76" }}
                  >
                    {lang}
                  </span>
                  {file && (
                    <span
                      className="font-mono text-xs"
                      style={{
                        color: theme === "dark" ? "#8b949e" : "#656d76",
                      }}
                    >
                      {file}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* <WrapLines setWrap={setWrap} wrap={wrap} /> */}
                  <Copy
                    text={String(children).replace(/\n$/, "")}
                    theme={theme}
                  />
                </div>
              </div>
              <div className="overflow-hidden py-2">
                <HLJS
                  style={themeObj}
                  language={lang}
                  PreTag="div"
                  className="overflow-x-auto"
                  showLineNumbers
                  lineNumberContainerStyle={{
                    "padding-right": "16px",
                    "padding-left": "16px",
                    "padding-top": "16px",
                    "padding-bottom": "16px",
                    color: theme === "dark" ? "#8b949e" : "#656d76",
                    "border-right": `1px solid ${theme === "dark" ? "#30363d" : "#d0d7de"}`,
                    "background-color":
                      theme === "dark" ? "#0d1117" : "#f6f8fa",
                    "font-size": "12px",
                    "min-width": "40px",
                    "text-align": "right",
                  }}
                  {...props}
                >
                  {text}
                </HLJS>
              </div>
            </div>
          ) : (
            <code
              className={className}
              style={{
                backgroundColor: theme === "dark" ? "#21262d" : "#f6f8fa",
                color: theme === "dark" ? "#c9d1d9" : "#24292e",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.875em",
                fontFamily:
                  "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                border: `1px solid ${theme === "dark" ? "#30363d" : "#d0d7de"}`,
              }}
              {...props}
            >
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
