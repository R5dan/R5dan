import { ipAddress } from "@vercel/functions";
import type { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  return Response.json({
    status: true,
    data: ipAddress(req),
  });
}
