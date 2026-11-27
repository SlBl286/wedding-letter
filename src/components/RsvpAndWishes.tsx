"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";

interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface RsvpAndWishesProps {
  invitationCode?: string;
  defaultName?: string;
  defaultSide?: "bride" | "groom" | "both";
}

export function RsvpAndWishes({
  invitationCode = "",
  defaultName = "",
  defaultSide = "both",
}: RsvpAndWishesProps) {
  const [activeTab, setActiveTab] = useState<"rsvp" | "wishes">("rsvp");

  // RSVP state
  const [rsvpName, setRsvpName] = useState(defaultName);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(1);
  const [side, setSide] = useState<"bride" | "groom" | "both">(defaultSide);
  const [note, setNote] = useState("");
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpError, setRsvpError] = useState("");
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null);

  // Wishes state
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishSubmitting, setWishSubmitting] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);
  const [wishError, setWishError] = useState("");

  useEffect(() => {
    fetch("/api/wishes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.wishes)) {
          setWishes(data.wishes);
        }
      })
      .catch(() => {});

    fetch("/api/rsvp")
      .then((res) => res.json())
      .then((data) => {
        if (data.summary && typeof data.summary.totalGuests === "number") {
          setConfirmedCount(data.summary.totalGuests);
        }
      })
      .catch(() => {});
  }, []);

  async function handleRsvpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRsvpError("");
    setRsvpSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_code: invitationCode,
          name: rsvpName,
          attending,
          guests,
          side,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRsvpError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        setRsvpSuccess(true);
        setRsvpName("");
        setNote("");
        if (attending === "yes") {
          setConfirmedCount((prev) => (prev ?? 0) + guests);
        }
      }
    } catch {
      setRsvpError("Không thể kết nối máy chủ.");
    } finally {
      setRsvpSubmitting(false);
    }
  }

  async function handleWishSubmit(e: React.FormEvent) {
    e.preventDefault();
    setWishError("");
    setWishSubmitting(true);

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: wishName,
          message: wishMessage,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setWishError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
      } else if (data.wish) {
        setWishes((prev) => [data.wish, ...prev]);
        setWishName("");
        setWishMessage("");
        setWishSuccess(true);
        setTimeout(() => setWishSuccess(false), 3000);
      }
    } catch {
      setWishError("Không thể kết nối máy chủ.");
    } finally {
      setWishSubmitting(false);
    }
  }

  return (
    <section
      id="rsvp"
      className="py-24 sm:py-32 px-6 max-w-3xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#696D66] mb-3">
          RSVP &amp; Guestbook
        </p>
        <h2 className="font-serif-display text-4xl sm:text-5xl font-light text-[#1B3424]">
          Phúc đáp &amp; Lời chúc
        </h2>
        {confirmedCount !== null && confirmedCount > 0 && (
          <p className="mt-3 text-xs tracking-[0.14em] text-[#696D66]">
            {confirmedCount} khách đã xác nhận tham dự
          </p>
        )}
      </motion.div>

      {/* Minimal Tab Switcher */}
      <div className="flex justify-center border-b border-[rgba(27,52,36,0.14)] mb-12">
        {(
          [
            { id: "rsvp", label: "Xác nhận tham dự" },
            { id: "wishes", label: `Lời chúc (${wishes.length})` },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3.5 text-xs uppercase tracking-[0.22em] transition-colors cursor-pointer ${
                active
                  ? "text-[#1B3424] font-medium"
                  : "text-[#696D66] hover:text-[#151815]"
              }`}
            >
              {tab.label}
              {active && (
                <motion.span
                  layoutId="rsvp-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#1B3424]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "rsvp" ? (
          <motion.div
            key="tab-rsvp"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {rsvpSuccess ? (
              <div className="border border-[rgba(27,52,36,0.18)] bg-[#F2F1EB]/70 px-8 py-12 text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1B3424] text-[#FAF9F5]">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="font-serif-display text-3xl font-light text-[#1B3424]">
                  Cảm ơn bạn đã phản hồi
                </h3>
                <p className="mt-2 text-sm text-[#696D66]">
                  Sự hiện diện của bạn là niềm hạnh phúc lớn nhất của Kim Anh &amp; Tiến Đạt.
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpSuccess(false)}
                  className="mt-8 border border-[#1B3424]/30 px-6 py-2.5 text-[11px] uppercase tracking-[0.22em] text-[#1B3424] hover:bg-[#1B3424] hover:text-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Gửi thêm phản hồi
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-8">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full border-b border-[rgba(27,52,36,0.22)] bg-transparent py-3 text-base text-[#151815] placeholder:text-[#696D66]/50 focus:border-[#1B3424] focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-3">
                      Tham dự
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { val: "yes", label: "Sẽ tham dự" },
                          { val: "no", label: "Rất tiếc bận" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setAttending(opt.val)}
                          className={`py-3 px-4 text-xs tracking-[0.12em] border transition-all cursor-pointer ${
                            attending === opt.val
                              ? "border-[#1B3424] bg-[#1B3424] text-[#FAF9F5]"
                              : "border-[rgba(27,52,36,0.2)] text-[#151815] hover:border-[#1B3424]/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-3">
                      Khách mời của
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { val: "bride", label: "Cô dâu" },
                          { val: "groom", label: "Chú rể" },
                          { val: "both", label: "Cả hai" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setSide(opt.val)}
                          className={`py-3 px-2 text-xs tracking-[0.08em] border transition-all cursor-pointer ${
                            side === opt.val
                              ? "border-[#3D2B24] bg-[#3D2B24] text-[#FAF9F5]"
                              : "border-[rgba(27,52,36,0.2)] text-[#151815] hover:border-[#3D2B24]/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {attending === "yes" && (
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-3">
                      Số lượng khách
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`h-10 w-12 text-xs border transition-all cursor-pointer ${
                            guests === num
                              ? "border-[#1B3424] bg-[#1B3424] text-[#FAF9F5]"
                              : "border-[rgba(27,52,36,0.2)] text-[#151815] hover:border-[#1B3424]/50"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-2">
                    Ghi chú (tuỳ chọn)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Yêu cầu ăn chay hoặc lời nhắn ngắn..."
                    className="w-full border-b border-[rgba(27,52,36,0.22)] bg-transparent py-3 text-sm text-[#151815] placeholder:text-[#696D66]/50 focus:border-[#1B3424] focus:outline-none transition-colors"
                  />
                </div>

                {rsvpError && (
                  <p className="text-xs text-[#8B2E2E]">{rsvpError}</p>
                )}

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    disabled={rsvpSubmitting}
                    className="inline-flex items-center justify-center gap-2.5 bg-[#1B3424] px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-[#FAF9F5] transition-all hover:bg-[#132519] disabled:opacity-50 cursor-pointer"
                  >
                    {rsvpSubmitting ? "Đang gửi..." : "Gửi xác nhận"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="tab-wishes"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <form onSubmit={handleWishSubmit} className="space-y-6">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-2">
                  Tên của bạn
                </label>
                <input
                  type="text"
                  required
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  placeholder="Tên hoặc biệt danh"
                  className="w-full border-b border-[rgba(27,52,36,0.22)] bg-transparent py-3 text-base text-[#151815] placeholder:text-[#696D66]/50 focus:border-[#1B3424] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.22em] text-[#696D66] mb-2">
                  Lời chúc
                </label>
                <textarea
                  rows={3}
                  required
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder="Gửi vài lời chúc tốt đẹp đến cô dâu & chú rể..."
                  className="w-full border-b border-[rgba(27,52,36,0.22)] bg-transparent py-3 text-sm text-[#151815] placeholder:text-[#696D66]/50 focus:border-[#1B3424] focus:outline-none transition-colors resize-none"
                />
              </div>

              {wishError && (
                <p className="text-xs text-[#8B2E2E]">{wishError}</p>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#2D4C37]">
                  {wishSuccess ? "Đã lưu lời chúc của bạn." : ""}
                </span>
                <button
                  type="submit"
                  disabled={wishSubmitting}
                  className="inline-flex items-center gap-2 bg-[#1B3424] px-8 py-3.5 text-[11px] uppercase tracking-[0.25em] text-[#FAF9F5] transition-all hover:bg-[#132519] disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {wishSubmitting ? "Đang gửi..." : "Gửi lời chúc"}
                </button>
              </div>
            </form>

            {/* Minimal Wishes List */}
            <div className="divide-y divide-[rgba(27,52,36,0.12)] border-t border-[rgba(27,52,36,0.12)]">
              {wishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="py-6"
                >
                  <p className="font-serif-display text-xl italic text-[#151815] leading-relaxed">
                    “{wish.message}”
                  </p>
                  <p className="mt-2.5 text-[11px] uppercase tracking-[0.24em] text-[#3D2B24]">
                    — {wish.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
