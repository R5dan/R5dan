import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  filename: z.string().optional().default("download.txt"),
  mimetype: z.string().optional().default("text/plain"),
  data: z.string().min(1, { message: "Data is required" }),
});

function download(r: unknown) {
  const { data, mimetype, filename } = schema.parse(r);
  const buffer = Buffer.from(data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimetype,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}

export function GET(req: NextRequest) {
  return download(req.nextUrl.searchParams);
}

export async function POST(req: NextRequest) {
  return download(await req.json());
}
