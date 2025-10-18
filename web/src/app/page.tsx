"use client";

import { useState } from "react";
import Download from "~/components/download";

export default function Home() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  return (
    <>
      <div>
        <button
          className="border-2 border-black"
          onClick={() => {
            console.log("Downloading");
            setDownloading(!downloading);
          }}
        >
          Downloading
        </button>{" "}
        <button
          className="border-2 border-black"
          onClick={() => {
            console.log("Downloaded");
            setDownloaded(!downloaded);
          }}
        >
          Downloaded
        </button>
        <div>
          Downloading: {downloading}
          Downloaded: {downloaded}
        </div>
      </div>
      <Download data={["abc"]} filename="test.txt" mimeType="text/plain" />
    </>
  );
}
