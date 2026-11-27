"use client";

import { AnimatePresence, motion } from "framer-motion";

interface EnvelopeIntroProps {
  isOpen: boolean;
  onOpen: () => void;
  salutation?: string;
  guestName?: string;
}

export function EnvelopeIntro({
  isOpen,
  onOpen,
  salutation = "Trân trọng kính mời",
  guestName,
}: EnvelopeIntroProps) {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="envelope-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, delay: 0.45 } }}
        >
          {/* Left curtain */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-[#1B3424] border-r border-[#FAF9F5]/10"
            initial={{ x: 0 }}
            exit={{
              x: "-100%",
              transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            }}
          />

          {/* Right curtain */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-[#1B3424] border-l border-[#FAF9F5]/10"
            initial={{ x: 0 }}
            exit={{
              x: "100%",
              transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            }}
          />

          {/* Luxury Framed Stationery Card */}
          <motion.div
            className="relative z-10 mx-6 w-full max-w-md border border-[#FAF9F5]/20 bg-[#132519]/75 backdrop-blur-sm px-8 py-12 sm:px-12 sm:py-14 text-center shadow-2xl"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
          >
            {/* Inner delicate hairline */}
            <div className="pointer-events-none absolute inset-2.5 border border-[#FAF9F5]/10" />

            <p className="text-[10px] uppercase tracking-[0.38em] text-[#FAF9F5]/65">
              {salutation}
            </p>

            {guestName && (
              <h2 className="mt-3 font-serif-display text-3xl sm:text-4xl text-[#FAF9F5] font-normal tracking-[0.02em]">
                {guestName}
              </h2>
            )}

            <div className="my-7 h-[1px] w-12 bg-[#FAF9F5]/20 mx-auto" />

            <button
              type="button"
              onClick={onOpen}
              aria-label="Mở thiệp cưới"
              className="group relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#FAF9F5]/35 bg-[#1B3424] text-[#FAF9F5] transition-all duration-500 hover:scale-105 hover:border-[#FAF9F5]/80 focus:outline-none cursor-pointer"
            >
              <span className="absolute -inset-2 rounded-full border border-[#FAF9F5]/15 transition-transform duration-700 group-hover:scale-110" />
              <div className="flex flex-col items-center">
                <span className="font-serif-display text-2xl tracking-[0.14em] font-normal">
                  K <span className="text-[#7C9668] italic">&amp;</span> Đ
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.32em] text-[#FAF9F5]/75 group-hover:text-[#FAF9F5] transition-colors">
                  Mở thiệp
                </span>
              </div>
            </button>

            <p className="mt-8 font-serif-display text-base tracking-[0.22em] text-[#FAF9F5]/80 font-normal uppercase">
              Kim Anh &amp; Tiến Đạt
            </p>
            <p className="mt-1.5 text-[10px] tracking-[0.28em] text-[#FAF9F5]/50">
              24 · 12 · 2026
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
