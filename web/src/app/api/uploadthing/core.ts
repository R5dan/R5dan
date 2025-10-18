import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();
export const uploadRouter = {
  router: f(["image/png", "image/jpeg", "image/webp"], {
    awaitServerData: true,
  })
    .input(z.object({}))
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
      };
    }),
} satisfies FileRouter;
