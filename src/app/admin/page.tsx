"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Lock, LogOut, Plus, Trash2 } from "lucide-react";

interface Invitation {
  id: number;
  code: string;
  guest_name: string;
  salutation: string;
  side: "bride" | "groom" | "both";
  note: string;
  created_at: string;
}

interface Rsvp {
  id: number;
  invitation_code: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  side: "bride" | "groom" | "both";
  note: string;
  created_at: string;
}

const SIDE_LABELS = {
  bride: "Cô dâu",
  groom: "Chú rể",
  both: "Cả hai",
} as const;

export default function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<"invitations" | "rsvps">("invitations");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);

  // Create form
  const [guestName, setGuestName] = useState("");
  const [salutation, setSalutation] = useState("Trân trọng kính mời");
  const [side, setSide] = useState<"bride" | "groom" | "both">("both");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function loadData() {
    const res = await fetch("/api/admin/invitations");
    if (res.ok) {
      const data = await res.json();
      setInvitations(data.invitations || []);
      setRsvps(data.rsvps || []);
    }
  }

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
          loadData();
        }
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Đăng nhập thất bại.");
      } else {
        setAuthenticated(true);
        setPassword("");
        await loadData();
      }
    } catch {
      setAuthError("Không thể kết nối máy chủ.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setInvitations([]);
    setRsvps([]);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: guestName,
          salutation,
          side,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Không thể tạo thiệp.");
      } else if (data.invitation) {
        setInvitations((prev) => [data.invitation, ...prev]);
        setGuestName("");
        setNote("");
        copyLink(data.invitation.code);
      }
    } catch {
      setCreateError("Không thể kết nối máy chủ.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/admin/invitations?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setInvitations((prev) => prev.filter((item) => item.id !== id));
    }
  }

  function copyLink(code: string) {
    const url = `${window.location.origin}/i/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#FAF9F5] flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.26em] text-[#696D66]">
          Đang kiểm tra...
        </p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-6">
        <div className="w-full max-w-sm border border-[rgba(27,52,36,0.16)] bg-[#F2F1EB]/60 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1B3424] text-[#FAF9F5]">
              <Lock className="h-4 w-4" />
            </div>
            <h1 className="font-serif-display text-3xl font-light text-[#1B3424]">
              Quản lý thiệp mời
            </h1>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.24em] text-[#696D66]">
              Kim Anh &amp; Tiến Đạt
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị"
                className="w-full border-b border-[rgba(27,52,36,0.24)] bg-transparent py-2.5 text-sm text-[#151815] focus:border-[#1B3424] focus:outline-none"
              />
            </div>

            {authError && (
              <p className="text-xs text-[#8B2E2E]">{authError}</p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#1B3424] py-3.5 text-[11px] uppercase tracking-[0.26em] text-[#FAF9F5] hover:bg-[#132519] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loggingIn ? "Đang xác thực..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#151815]">
      <header className="border-b border-[rgba(27,52,36,0.12)] bg-[#F2F1EB]/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif-display text-xl text-[#1B3424]">
              K &amp; Đ
            </span>
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#696D66]">
              Quản lý thiệp mời
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#696D66] hover:text-[#1B3424] cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Create Invitation Form */}
        <section className="border border-[rgba(27,52,36,0.14)] bg-[#F2F1EB]/40 p-6 sm:p-8">
          <h2 className="font-serif-display text-2xl sm:text-3xl font-light text-[#1B3424] mb-6">
            Tạo đường dẫn thiệp riêng
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#696D66] mb-2">
                Tên khách mời *
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="VD: Anh Minh & Gia đình"
                className="w-full border-b border-[rgba(27,52,36,0.22)] bg-transparent py-2.5 text-sm focus:border-[#1B3424] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#696D66] mb-2">
                Lời xưng hô
              </label>
              <input
                type="text"
                value={salutation}
                onChange={(e) => setSalutation(e.target.value)}
                placeholder="Trân trọng kính mời"
                className="w-full border-b border-[rgba(27,52,36,0.22)] bg-transparent py-2.5 text-sm focus:border-[#1B3424] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#696D66] mb-2">
                Khách mời của
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["bride", "groom", "both"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    className={`py-2.5 text-xs border transition-colors cursor-pointer ${
                      side === s
                        ? "border-[#1B3424] bg-[#1B3424] text-[#FAF9F5]"
                        : "border-[rgba(27,52,36,0.2)] text-[#151815]"
                    }`}
                  >
                    {SIDE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#696D66] mb-2">
                Ghi chú riêng (tuỳ chọn)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Bàn số, mối quan hệ..."
                className="w-full border-b border-[rgba(27,52,36,0.22)] bg-transparent py-2.5 text-sm focus:border-[#1B3424] focus:outline-none"
              />
            </div>

            {createError && (
              <p className="sm:col-span-2 text-xs text-[#8B2E2E]">{createError}</p>
            )}

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 bg-[#1B3424] px-7 py-3 text-[11px] uppercase tracking-[0.24em] text-[#FAF9F5] hover:bg-[#132519] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {creating ? "Đang tạo..." : "Tạo link thiệp"}
              </button>
            </div>
          </form>
        </section>

        {/* Tabs */}
        <div>
          <div className="flex border-b border-[rgba(27,52,36,0.14)] mb-6">
            <button
              type="button"
              onClick={() => setTab("invitations")}
              className={`px-6 py-3 text-xs uppercase tracking-[0.22em] border-b-2 transition-colors cursor-pointer ${
                tab === "invitations"
                  ? "border-[#1B3424] text-[#1B3424] font-medium"
                  : "border-transparent text-[#696D66]"
              }`}
            >
              Danh sách thiệp ({invitations.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("rsvps")}
              className={`px-6 py-3 text-xs uppercase tracking-[0.22em] border-b-2 transition-colors cursor-pointer ${
                tab === "rsvps"
                  ? "border-[#1B3424] text-[#1B3424] font-medium"
                  : "border-transparent text-[#696D66]"
              }`}
            >
              Phúc đáp RSVP ({rsvps.length})
            </button>
          </div>

          {tab === "invitations" ? (
            invitations.length === 0 ? (
              <p className="text-sm text-[#696D66] py-8 text-center">
                Chưa có thiệp mời nào được tạo.
              </p>
            ) : (
              <div className="divide-y divide-[rgba(27,52,36,0.12)] border-y border-[rgba(27,52,36,0.12)]">
                {invitations.map((inv) => {
                  const matchedRsvp = rsvps.find(
                    (r) => r.invitation_code === inv.code
                  );
                  return (
                    <div
                      key={inv.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-serif-display text-xl text-[#1B3424]">
                            {inv.guest_name}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 border border-[rgba(27,52,36,0.2)] text-[#3D2B24]">
                            {SIDE_LABELS[inv.side]}
                          </span>
                          {matchedRsvp && (
                            <span
                              className={`text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 ${
                                matchedRsvp.attending === "yes"
                                  ? "bg-[#1B3424] text-[#FAF9F5]"
                                  : "bg-[#3D2B24] text-[#FAF9F5]"
                              }`}
                            >
                              {matchedRsvp.attending === "yes"
                                ? `Tham dự (${matchedRsvp.guests})`
                                : "Không tham dự"}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#696D66] font-mono">
                          /i/{inv.code}
                          {inv.note ? ` · ${inv.note}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyLink(inv.code)}
                          className="inline-flex items-center gap-1.5 border border-[rgba(27,52,36,0.24)] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#1B3424] hover:bg-[#1B3424] hover:text-[#FAF9F5] transition-colors cursor-pointer"
                        >
                          {copiedCode === inv.code ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Đã chép
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy link
                            </>
                          )}
                        </button>

                        <a
                          href={`/i/${inv.code}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 border border-[rgba(27,52,36,0.24)] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#151815] hover:border-[#1B3424] transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Mở
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDelete(inv.id)}
                          aria-label="Xoá thiệp"
                          className="p-2 text-[#696D66] hover:text-[#8B2E2E] transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : rsvps.length === 0 ? (
            <p className="text-sm text-[#696D66] py-8 text-center">
              Chưa có phản hồi RSVP nào.
            </p>
          ) : (
            <div className="divide-y divide-[rgba(27,52,36,0.12)] border-y border-[rgba(27,52,36,0.12)]">
              {rsvps.map((r) => (
                <div
                  key={r.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-serif-display text-lg text-[#1B3424]">
                      {r.name}
                    </p>
                    <p className="text-xs text-[#696D66]">
                      {SIDE_LABELS[r.side]}
                      {r.invitation_code ? ` · Mã: ${r.invitation_code}` : ""}
                      {r.note ? ` · "${r.note}"` : ""}
                    </p>
                  </div>
                  <span
                    className={`self-start sm:self-center text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 ${
                      r.attending === "yes"
                        ? "bg-[#1B3424] text-[#FAF9F5]"
                        : "bg-[#3D2B24] text-[#FAF9F5]"
                    }`}
                  >
                    {r.attending === "yes"
                      ? `Tham dự · ${r.guests} khách`
                      : "Không tham dự"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
