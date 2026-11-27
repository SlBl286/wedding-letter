import { notFound } from "next/navigation";
import { getDb, type InvitationRecord } from "@/lib/db";
import { WeddingPage } from "@/components/WeddingPage";

export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const db = getDb();
  const invitation = db
    .prepare(
      "SELECT id, code, guest_name, salutation, side, note, created_at FROM invitations WHERE code = ?"
    )
    .get(code) as InvitationRecord | undefined;

  if (!invitation) {
    notFound();
  }

  return <WeddingPage invitation={{ ...invitation }} />;
}
