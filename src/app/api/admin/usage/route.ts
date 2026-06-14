import { NextResponse } from "next/server";
import { getUsageSummary } from "@/lib/usage/serverStore";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = process.env.ADMIN_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN is not configured." },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getUsageSummary());
}
