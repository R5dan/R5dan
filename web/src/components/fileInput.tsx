"use client";

import React, { useRef, type ReactElement } from "react";

export default function FileInput({
  children,
  handleFile = async () => {
    return;
  },
  fileTypes,
  onClick = () => {
    return;
  },
}: {
  children: React.ReactNode;
  handleFile?: (file: File | null) => Promise<void>;
  onClick?: () => void;
  fileTypes?: string[] | string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="my-auto flex items-center gap-4">
      {/* Hidden file input */}
      <input
        type="file"
        onChange={(e) => handleFile(e.target.files![0] ?? null)}
        className="hidden"
        ref={fileInputRef}
        accept={
          typeof fileTypes === "string"
            ? fileTypes
            : fileTypes
              ? fileTypes.join(",")
              : undefined
        }
      />

      {/* Styled button */}
      <button
        type="button"
        onClick={() => {
          onClick();
          fileInputRef.current!.click();
        }}
      >
        {children}
      </button>
    </div>
  );
}
