import { NextResponse } from "next/server";
import { getDb, type RsvpRecord } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id, name, attending, guests, side, note, created_at FROM rsvps ORDER BY id DESC LIMIT 100"
      )
      .all() as RsvpRecord[];

    const summary = db
      .prepare(
        `SELECT
          COUNT(*) as total,
          COALESCE(SUM(CASE WHEN attending = 'yes' THEN guests ELSE 0 END), 0) as totalGuests
        FROM rsvps`
      )
      .get() as { total: number; totalGuests: number };

    return NextResponse.json({ rsvps: rows, summary });
  } catch (error) {
    console.error("GET /api/rsvp error:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách xác nhận." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const invitationCode =
      typeof body.invitation_code === "string"
        ? body.invitation_code.trim().slice(0, 32)
        : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const attending = body.attending === "no" ? "no" : "yes";
    const guests =
      attending === "yes"
        ? Math.min(10, Math.max(1, Number(body.guests) || 1))
        : 0;
    const side =
      body.side === "bride" || body.side === "groom" ? body.side : "both";
    const note =
      typeof body.note === "string" ? body.note.trim().slice(0, 300) : "";

    if (!name || name.length > 80) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên hợp lệ." },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = db
      .prepare(
        "INSERT INTO rsvps (invitation_code, name, attending, guests, side, note) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, invitation_code, name, attending, guests, side, note, created_at"
      )
      .get(invitationCode, name, attending, guests, side, note) as RsvpRecord;

    return NextResponse.json({ rsvp: result }, { status: 201 });
  } catch (error) {
    console.error("POST /api/rsvp error:", error);
    return NextResponse.json(
      { error: "Không thể lưu xác nhận tham dự." },
      { status: 500 }
    );
  }
}
