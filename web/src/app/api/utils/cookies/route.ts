import type { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  return Response.json({
    status: true,
    data: req.cookies
      .getAll()
      .reduce<Record<string, string>>((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {}),
  });
}
