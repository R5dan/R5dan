import type { HTMLAttributes } from "react";

export default function DownloadArrow(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-download"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 15V3" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}
