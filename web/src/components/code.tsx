"use client";

import { type BundledLanguage, type ShikiTransformer } from "shiki";
import { transformerTwoslash } from "@shikijs/twoslash";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from "@shikijs/transformers";
import Download from "./download";
import Copy from "./copy";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, useEffect, useState, type JSX } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { highlighter } from "~/server/blogs/shiki";

type Props = {
  children: string;
  lang: BundledLanguage;
  mime: string;
  title?: string;
  path?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showHeader?: boolean;
  showLanguage?: boolean;
};

function transformerLineNumbers({
  start,
  skip,
  diffs,
}: {
  start: number;
  skip: number;
  diffs: boolean;
}) {
  let curLine = start;
  let lineNoLength = 1;
  return {
    code(hast) {
      lineNoLength = hast.children.length.toString().length;
    },
    line(hast) {
      curLine += 1;
      if (
        diffs &&
        "className" in hast.properties &&
        (hast.properties.className as string[]).includes("remove")
      ) {
        curLine -= 1;
      }
      return {
        ...hast,
        children: [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: "line-number",
            },
            children: [
              {
                type: "text",
                value: curLine.toString().padStart(lineNoLength, " "),
              },
            ],
          },
          {
            type: "element",
            tagName: "div",
            properties: {},
            children: hast.children,
          },
        ],
      };
    },
  } satisfies ShikiTransformer;
}

export default function CodeBlock({
  children,
  lang,
  mime,
  title,
  path,
  showLineNumbers = true,
  showCopyButton = true,
  showDownloadButton = true,
  showHeader = true,
  showLanguage = true,
}: Props) {
  const [html, setHTML] = useState<JSX.Element>();
  useEffect(() => {
    void highlighter
      .then((highlighter) =>
        highlighter.codeToHast(children, {
          lang,
          themes: { light: "github", dark: "github-dark" },
          transformers: [
            transformerTwoslash({
              explicitTrigger: true,
            }),
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationFocus(),
            showLineNumbers
              ? transformerLineNumbers({
                  start: 1,
                  skip: 1,
                  diffs: true,
                })
              : {},
          ],
        }),
      )
      .then((hast) =>
        setHTML(
          toJsxRuntime(hast, {
            Fragment,
            jsx,
            jsxs,
          }) as JSX.Element,
        ),
      );
  }, [children, lang, showLineNumbers]);

  return (
    <div
      className="my-5 rounded-lg border-8 border-gray-900"
      style={{ backgroundColor: "var(--color-gray-900)" }}
    >
      {showHeader && (
        <div className="text-s center flex justify-between rounded-t-md border-8 border-[#1f2938] bg-[#1f2938] text-gray-500">
          <span className="my-auto text-center font-mono">{lang}</span>
          <div className="flex justify-between gap-5">
            {showDownloadButton && <Download id={"abc"} />}
            {showCopyButton && (
              <Copy text={String(children).replace(/\n$/, "")} />
            )}
          </div>
        </div>
      )}
      <div className="rounded-b-md border-8">
        {showCopyButton && <Copy text={String(children).replace(/\n$/, "")} />}
        {html}
      </div>
    </div>
  );
}
