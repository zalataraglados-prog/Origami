import { NextRequest, NextResponse } from "next/server";
import { downloadAttachment } from "@/lib/r2";
import { db } from "@/lib/db";
import { attachments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);

  const rows = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, decodedKey));

  const attachment = rows[0];
  if (!attachment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { body, contentType } = await downloadAttachment(attachment.r2ObjectKey);

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(attachment.filename ?? "file")}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch attachment" }, { status: 500 });
  }
}
