import { z } from "zod";
import {
  //  deleteRedirect,
  //  getAllRedirects,
  getNextID,
  //  getRedirect,
  setRedirect,
} from "~/server/upstash/redis";

const CREATE = z.object({
  url: z.string().url(),
});

export async function POST(req: Request) {
  const input = (await req.json()) as z.infer<typeof CREATE>;
  const data = CREATE.safeParse(input);
  if (!data.success) {
    return Response.json(
      {},
      {
        status: 400,
      },
    );
  }
  const id = await getNextID();
  if (id.isErr()) {
    return Response.json(
      {},
      {
        status: 500,
      },
    );
  }

  const url = new URL(data.data.url);
  const setResult = await setRedirect(id.value, url.toString());
  if (setResult.isErr()) {
    return Response.json(
      {},
      {
        status: 500,
      },
    );
  }

  return Response.json({ id: id.value, url: url.toString() });
}
