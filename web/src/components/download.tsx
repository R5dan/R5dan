"use client";

import DownloadIcon from "~/icons/download";
import React from "react";
import { toast } from "sonner";

interface LinkProps {
  link: string;
  data?: null;
  filename?: null;
  mimeType?: null;
  id?: null;
}

interface DataProps {
  data: string[];
  filename: string;
  mimeType: string;
  link?: null;
  id?: null;
}

interface IdProps {
  id: string;
  filename?: string;
  mimeType?: null;
  link?: null;
  data?: null;
}

type Props = DataProps | LinkProps | IdProps;

export default function Download({
  link,
  data,
  filename,
  mimeType,
  id,
}: Props) {
  const [downloading, setDownloading] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);

  const handleDownload = (url: string, filename?: string) => {
    const link = document.createElement("a");
    link.href = url;
    if (filename) {
      link.download = filename;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function onClick() {
    setDownloading(true);
    const toastId = toast.loading("Downloading...");
    try {
      if (id) {
        handleDownload(`/api/download/${id}`, filename);
      } else if (data) {
        handleDownload(
          `/api/download?data=${data.toString()}&mimetype=${mimeType}&filename=${filename}`,
          filename,
        );
      } else if (link) {
        handleDownload(link, filename ?? undefined);
      }
    } catch (e) {
      console.error(`Download failed: ${String(e)}`);
      toast.error("Download failed!", {
        id: toastId,
      });
    }

    toast.success("Downloaded!", {
      id: toastId,
    });
    setDownloading(false);
    setDownloaded(true);
  }

  return (
    <button onClick={onClick}>
      <DownloadIcon downloading={downloading} downloaded={downloaded} />
    </button>
  );
}
