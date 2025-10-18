"use client";

import { useSearchParams } from "next/navigation";

export default function Page() {
  // const params = useSearchParams();
  // const filter: Record<string, Record<"inc" | "rem", string[]>> = {};

  // Object.entries(params).forEach(([key, value]) => {
  //   if (typeof value !== "string") {
  //     return;
  //   }
  //   if (key.startsWith("inc-")) {
  //     const item = key.slice(4);
  //     if (item in filter) {
  //       filter[item]?.inc.push(value);
  //     } else {
  //       filter[item] = {
  //         inc: [value],
  //         rem: [],
  //       };
  //     }
  //   } else if (key.startsWith("dec-")) {
  //     const item = key.slice(4);
  //     if (item in filter) {
  //       filter[item]?.rem.push(value);
  //     } else {
  //       filter[item] = {
  //         inc: [],
  //         rem: [value],
  //       };
  //     }
  //   }
  // });

  return <h1>TODO</h1>;
}
