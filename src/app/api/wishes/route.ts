import { NextResponse } from "next/server";
import { getDb, type WishRecord } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const wishes = db
      .prepare(
        "SELECT id, name, message, created_at FROM wishes ORDER BY id DESC LIMIT 60"
      )
      .all() as WishRecord[];

    return NextResponse.json({ wishes });
  } catch (error) {
    console.error("GET /api/wishes error:", error);
    return NextResponse.json(
      { error: "Không thể tải lời chúc." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length > 80) {
      return NextResponse.json(
        { error: "Vui lòng nhập tên của bạn." },
        { status: 400 }
      );
    }

    if (!message || message.length > 400) {
      return NextResponse.json(
        { error: "Vui lòng nhập lời chúc (tối đa 400 ký tự)." },
        { status: 400 }
      );
    }

    const db = getDb();
    const wish = db
      .prepare(
        "INSERT INTO wishes (name, message) VALUES (?, ?) RETURNING id, name, message, created_at"
      )
      .get(name, message) as WishRecord;

    return NextResponse.json({ wish }, { status: 201 });
  } catch (error) {
    console.error("POST /api/wishes error:", error);
    return NextResponse.json(
      { error: "Không thể gửi lời chúc." },
      { status: 500 }
    );
  }
}
