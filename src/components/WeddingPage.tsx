"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, X } from "lucide-react";
import { EnvelopeIntro } from "./EnvelopeIntro";
import { CountdownTimer } from "./CountdownTimer";
import { RsvpAndWishes } from "./RsvpAndWishes";
import type { InvitationRecord } from "@/lib/db";

const HERO_SLIDES = [
  {
    src: "/images/landscapes/HAJJ8254(1) copy.jpg",
    alt: "Kim Anh & Tiến Đạt giữa khu rừng xanh",
    objectPosition: "center 35%",
  },
  {
    src: "/images/landscapes/HAJJ8179(1) copy.jpg",
    alt: "Kim Anh tựa vai Tiến Đạt dưới nắng",
    objectPosition: "center 28%",
  },
];

const GALLERY_PHOTOS = [
  {
    src: "/images/portraits/HAJJ9224 copy.jpg",
    alt: "Kim Anh & Tiến Đạt dưới khăn voan ren",
    caption: "Under the veil",
  },
  {
    src: "/images/portraits/HAJJ8884 copy.jpg",
    alt: "Kim Anh & Tiến Đạt nắm tay dạo bước",
    caption: "Hand in hand",
  },
  {
    src: "/images/portraits/HAJJ9156(1) copy.jpg",
    alt: "Khoảnh khắc nhẫn cưới của Kim Anh & Tiến Đạt",
    caption: "Forever begins",
  },
];

interface WeddingPageProps {
  invitation: InvitationRecord;
}

export function WeddingPage({ invitation }: WeddingPageProps) {
  const [opened, setOpened] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageScale = useTransform(heroScroll, [0, 1], [1.02, 1.1]);

  function nextSlide() {
    setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }

  function prevSlide() {
    setSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }

  return (
    <div className="relative min-h-screen bg-[#FAF9F5] text-[#151815]">
      <EnvelopeIntro
        isOpen={opened}
        onOpen={() => setOpened(true)}
        salutation={invitation.salutation}
        guestName={invitation.guest_name}
      />

      {/* Top Scroll Progress Hairline */}
      <motion.div
        style={{ scaleX: smoothProgress }}
        className="fixed top-0 left-0 right-0 z-40 h-[2px] origin-left bg-[#1B3424]"
      />

      <main id="top">
        {/* FULL-BLEED EDITORIAL HERO */}
        <section
          ref={heroRef}
          className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-[#1B3424] flex flex-col justify-between"
        >
          {/* Background Landscape Photo Slider */}
          <motion.div
            style={{ scale: heroImageScale }}
            className="absolute inset-0"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={HERO_SLIDES[slideIdx].src}
                src={HERO_SLIDES[slideIdx].src}
                alt={HERO_SLIDES[slideIdx].alt}
                style={{ objectPosition: HERO_SLIDES[slideIdx].objectPosition }}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
          </motion.div>

          {/* Soft Forest-Green Vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(19, 37, 25, 0.62) 0%, rgba(19, 37, 25, 0.25) 40%, rgba(19, 37, 25, 0.04) 68%, rgba(19, 37, 25, 0.55) 100%)",
            }}
          />

          {/* Subtle Editorial Inner Frame */}
          <div className="pointer-events-none absolute inset-4 sm:inset-7 border border-[#FAF9F5]/20 z-10" />

          {/* Top Couple Nameplate + Centered Minimal Nav */}
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 pt-10 sm:pt-12 px-6 flex flex-col items-center text-[#FAF9F5]"
          >
            <div className="relative flex items-center justify-center">
              <span className="font-serif-display text-2xl sm:text-4xl tracking-[0.06em] font-normal pr-2">
                Kim Anh
              </span>
              <span className="font-serif-display italic text-4xl sm:text-5xl text-[#FAF9F5]/50 -mx-1 select-none leading-none">
                &amp;
              </span>
              <span className="font-serif-display text-2xl sm:text-4xl tracking-[0.06em] font-normal pl-2">
                Tiến Đạt
              </span>
            </div>

            <nav className="mt-5 flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#FAF9F5]/85">
              <a
                href="#invitation"
                className="text-[#FAF9F5] font-medium hover:opacity-80 transition-opacity"
              >
                Thiệp mời
              </a>
              <span className="h-[1px] w-3 bg-[#FAF9F5]/35" />
              <a
                href="#gallery"
                className="hover:text-[#FAF9F5] transition-colors"
              >
                Khoảnh khắc
              </a>
              <span className="h-[1px] w-3 bg-[#FAF9F5]/35" />
              <a
                href="#details"
                className="hover:text-[#FAF9F5] transition-colors"
              >
                Địa điểm
              </a>
              <span className="h-[1px] w-3 bg-[#FAF9F5]/35" />
              <a
                href="#rsvp"
                className="hover:text-[#FAF9F5] transition-colors"
              >
                Phúc đáp
              </a>
            </nav>
          </motion.header>

          {/* Center-Upper Flowing Handwritten Script Headline */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 px-6 text-center -mt-28 sm:-mt-36 pointer-events-none"
          >
            <h1 className="font-script text-6xl sm:text-8xl md:text-[7rem] text-[#FAF9F5] font-normal leading-[1.05] drop-shadow-[0_2px_20px_rgba(19,37,25,0.45)]">
              Me and you. Just us two.
            </h1>
            <p className="mt-3 sm:mt-4 font-serif-display text-lg sm:text-2xl tracking-[0.28em] text-[#FAF9F5]/95">
              24 · 12 · 2026
            </p>
            <p className="mt-1.5 text-xs sm:text-sm tracking-[0.14em] text-[#FAF9F5]/80 font-light">
              16 tháng 11 năm Bính Ngọ · Vĩnh Phúc
            </p>
          </motion.div>

          {/* Bottom Centered Slider Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={opened ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative z-10 pb-8 sm:pb-10 flex items-center justify-center gap-6 text-[#FAF9F5]/90"
          >
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Ảnh trước"
              className="p-1.5 hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 stroke-[1.25]" />
            </button>
            <span className="text-[11px] tracking-[0.24em] font-light tabular-nums">
              {slideIdx + 1} / {HERO_SLIDES.length}
            </span>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Ảnh tiếp theo"
              className="p-1.5 hover:text-white hover:translate-x-0.5 transition-all cursor-pointer"
            >
              <ArrowRight className="h-4 w-4 stroke-[1.25]" />
            </button>
          </motion.div>
        </section>

        {/* ARCHITECTURAL INVITATION CARD & COUNTDOWN */}
        <section
          id="invitation"
          className="py-24 sm:py-32 px-6 bg-[#F2F1EB]/55 border-b border-[rgba(27,52,36,0.12)]"
        >
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative bg-[#FAF9F5] border border-[rgba(27,52,36,0.15)] px-7 py-12 sm:px-14 sm:py-16 text-center shadow-[0_24px_60px_-28px_rgba(27,52,36,0.14)]">
              <div className="pointer-events-none absolute inset-3 border border-[rgba(27,52,36,0.08)]" />

              <p className="text-[10px] uppercase tracking-[0.36em] text-[#696D66]">
                {invitation.salutation}
              </p>
              <h2 className="mt-3 font-serif-display text-3xl sm:text-4xl text-[#1B3424] font-normal">
                {invitation.guest_name}
              </h2>

              <div className="my-7 h-[1px] w-12 bg-[rgba(27,52,36,0.2)] mx-auto" />

              <p className="font-serif-display text-xl sm:text-2xl italic text-[#3D2B24] leading-relaxed max-w-lg mx-auto">
                “Hai tâm hồn, một nhịp đập — cùng nhau bước vào chương mới của cuộc đời.”
              </p>

              <p className="mt-6 text-xs uppercase tracking-[0.26em] text-[#696D66]">
                Thứ Năm · 24 · 12 · 2026
              </p>
            </div>

            <div className="mt-14">
              <CountdownTimer />
            </div>
          </motion.div>
        </section>

        {/* EDITORIAL LOOKBOOK GALLERY (3 Portrait Photos) */}
        <section
          id="gallery"
          className="py-24 sm:py-32 px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4 border-b border-[rgba(27,52,36,0.12)] pb-6"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#696D66] mb-2">
                Our Moments
              </p>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-normal text-[#1B3424]">
                Khoảnh khắc
              </h2>
            </div>
            <p className="text-xs tracking-[0.16em] text-[#696D66]">
              Chạm vào ảnh để phóng to
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-center">
            {/* Featured Portrait */}
            <motion.div
              className="md:col-span-6"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                onClick={() => setLightboxSrc(GALLERY_PHOTOS[0].src)}
                className="overflow-hidden border border-[rgba(27,52,36,0.14)] bg-[#F2F1EB] aspect-[3/4] cursor-zoom-in group"
              >
                <img
                  src={GALLERY_PHOTOS[0].src}
                  alt={GALLERY_PHOTOS[0].alt}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.26em] text-[#696D66]">
                01 — {GALLERY_PHOTOS[0].caption}
              </p>
            </motion.div>

            {/* Stacked Editorial Pair */}
            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 items-start">
              {GALLERY_PHOTOS.slice(1).map((photo, idx) => (
                <motion.div
                  key={photo.src}
                  className={idx === 1 ? "sm:mt-16" : ""}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.85,
                    delay: (idx + 1) * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div
                    onClick={() => setLightboxSrc(photo.src)}
                    className="overflow-hidden border border-[rgba(27,52,36,0.14)] bg-[#F2F1EB] aspect-[3/4] cursor-zoom-in group"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.26em] text-[#696D66]">
                    {String(idx + 2).padStart(2, "0")} — {photo.caption}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CEREMONY & RECEPTION (Deep Forest Green Luxury Block) */}
        <section
          id="details"
          className="bg-[#1B3424] text-[#FAF9F5] py-24 sm:py-32 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-16"
            >
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#FAF9F5]/60 mb-3">
                The Celebration
              </p>
              <h2 className="font-serif-display text-4xl sm:text-5xl font-normal">
                Thông tin lễ cưới
              </h2>
              <p className="mt-3 font-serif-display text-lg italic text-[#FAF9F5]/75">
                Thứ Năm, 24 · 12 · 2026 — 16 tháng 11 năm Bính Ngọ
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="border border-[#FAF9F5]/18 bg-[#132519]/45 p-8 sm:p-10 text-center"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#7C9668]">
                  09:30 · 24.12.2026
                </span>
                <h3 className="mt-4 font-serif-display text-3xl font-normal">
                  Lễ Thành Hôn
                </h3>
                <div className="my-6 h-[1px] w-10 bg-[#FAF9F5]/25 mx-auto" />
                <p className="text-sm text-[#FAF9F5]/85 leading-relaxed">
                  Vĩnh Phúc
                </p>
                <p className="mt-1 text-xs text-[#FAF9F5]/60">
                  Địa điểm chi tiết sẽ được cập nhật
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.8,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border border-[#FAF9F5]/18 bg-[#132519]/45 p-8 sm:p-10 text-center"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#7C9668]">
                  11:00 · 24.12.2026
                </span>
                <h3 className="mt-4 font-serif-display text-3xl font-normal">
                  Tiệc Chung Vui
                </h3>
                <div className="my-6 h-[1px] w-10 bg-[#FAF9F5]/25 mx-auto" />
                <p className="text-sm text-[#FAF9F5]/85 leading-relaxed">
                  Vĩnh Phúc
                </p>
                <p className="mt-1 text-xs text-[#FAF9F5]/60">
                  Địa điểm chi tiết sẽ được cập nhật
                </p>
                <a
                  href="https://maps.google.com/?q=Vinh+Phuc+Vietnam"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 border border-[#FAF9F5]/30 px-5 py-2 text-[10px] uppercase tracking-[0.24em] text-[#FAF9F5] hover:bg-[#FAF9F5] hover:text-[#1B3424] transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  Bản đồ
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-14 pt-8 border-t border-[#FAF9F5]/12 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs tracking-[0.2em] uppercase text-[#FAF9F5]/70"
            >
              <span>Dress Code</span>
              <div className="flex items-center gap-2.5">
                <span
                  title="Ivory White"
                  className="h-4 w-4 rounded-full bg-[#FAF9F5] border border-white/30"
                />
                <span
                  title="Forest Green"
                  className="h-4 w-4 rounded-full bg-[#2D4C37] border border-white/30"
                />
                <span
                  title="Espresso Brown"
                  className="h-4 w-4 rounded-full bg-[#3D2B24] border border-white/30"
                />
                <span
                  title="Charcoal Black"
                  className="h-4 w-4 rounded-full bg-[#151815] border border-white/30"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* RSVP & WISHES (SQLite-backed) */}
        <RsvpAndWishes
          invitationCode={invitation.code}
          defaultName={invitation.guest_name}
          defaultSide={invitation.side}
        />
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="border-t border-[rgba(27,52,36,0.12)] py-16 px-6 text-center bg-[#F2F1EB]/40">
        <p className="font-serif-display text-3xl font-normal text-[#1B3424] tracking-[0.12em]">
          Kim Anh &amp; Tiến Đạt
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#696D66]">
          24 · 12 · 2026 — Vĩnh Phúc
        </p>
      </footer>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#151815]/90 p-4 sm:p-8 backdrop-blur-sm cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              aria-label="Đóng ảnh"
              className="absolute top-6 right-6 text-[#FAF9F5]/80 hover:text-[#FAF9F5] transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              src={lightboxSrc}
              alt="Wedding photo preview"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] max-w-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
