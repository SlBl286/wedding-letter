import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDb, type InvitationRecord, type RsvpRecord } from "@/lib/db";

export const dynamic = "force-dynamic";

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex");
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const invitations = db
      .prepare(
        "SELECT id, code, guest_name, salutation, side, note, created_at FROM invitations ORDER BY id DESC"
      )
      .all() as InvitationRecord[];

    const rsvps = db
      .prepare(
        "SELECT id, invitation_code, name, attending, guests, side, note, created_at FROM rsvps ORDER BY id DESC"
      )
      .all() as RsvpRecord[];

    return NextResponse.json({ invitations, rsvps });
  } catch (error) {
    console.error("GET /api/admin/invitations error:", error);
    return NextResponse.json(
      { error: "Không thể tải danh sách thiệp mời." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const guestName =
      typeof body.guest_name === "string" ? body.guest_name.trim() : "";
    const salutation =
      typeof body.salutation === "string" && body.salutation.trim()
        ? body.salutation.trim().slice(0, 80)
        : "Trân trọng kính mời";
    const side =
      body.side === "bride" || body.side === "groom" ? body.side : "both";
    const note =
      typeof body.note === "string" ? body.note.trim().slice(0, 200) : "";

    if (!guestName || guestName.length > 100) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên khách mời (tối đa 100 ký tự)." },
        { status: 400 }
      );
    }

    const db = getDb();
    let code = generateCode();
    // Ensure uniqueness
    while (
      db.prepare("SELECT 1 FROM invitations WHERE code = ?").get(code)
    ) {
      code = generateCode();
    }

    const invitation = db
      .prepare(
        "INSERT INTO invitations (code, guest_name, salutation, side, note) VALUES (?, ?, ?, ?, ?) RETURNING id, code, guest_name, salutation, side, note, created_at"
      )
      .get(code, guestName, salutation, side, note) as InvitationRecord;

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/invitations error:", error);
    return NextResponse.json(
      { error: "Không thể tạo thiệp mời." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "ID không hợp lệ." }, { status: 400 });
    }

    const db = getDb();
    db.prepare("DELETE FROM invitations WHERE id = ?").run(id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/admin/invitations error:", error);
    return NextResponse.json(
      { error: "Không thể xoá thiệp mời." },
      { status: 500 }
    );
  }
}
