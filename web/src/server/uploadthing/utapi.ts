"use server";

import { UTApi } from "uploadthing/server";
import env from "~/env";

export const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
});

export async function getFile(fileKey: string) {
  const res = await fetch(await getFileUrl(fileKey));
  const blob = await res.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  return buffer;
}

export async function getFileUrl(fileKey: string) {
  return `https://${env.UPLOADTHING_TOKEN}.ufs.sh/f/${fileKey}`;
}
