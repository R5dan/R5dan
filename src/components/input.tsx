import React, { useRef } from "react";

export default function FileInput({ children, handleFile }: {
  children: React.ReactNode;
    handleFile: (file: File | null) => Promise<void>;
  }
) {
  const fileInputRef = useRef(null);

  return (
    <div className="my-auto flex items-center gap-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFile(e.target.files![0] ?? null)}
        className="hidden"
        accept="image/png, image/jpeg, image/webp, pdf, text"
      />

      {/* Styled button */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:hover:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-700"
      >
        {children}
      </button>
    </div>
  );
};
