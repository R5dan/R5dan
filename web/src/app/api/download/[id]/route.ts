import { api } from "../../../../../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { getFile } from "~/server/uploadthing";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const data = await fetchQuery(api.storage.getFile, { fileKey: id });

  const buffer = await getFile(data.fileKey);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": data.mimeType,
      "Content-Disposition": `attachment; filename="${data.fileName}"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}
