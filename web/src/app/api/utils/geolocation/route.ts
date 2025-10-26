import { geolocation } from "@vercel/functions";
import type { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const details = geolocation(req);
  return Response.json({
    status: true,
    data: details,
  });
}
