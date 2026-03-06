import { NextRequest, NextResponse } from "next/server";
import { syncAll } from "@/actions/sync";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { results } = await syncAll();
  return NextResponse.json({ ok: true, results });
}
