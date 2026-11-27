"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date("2026-12-24T11:00:00+07:00").getTime();

function computeTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(computeTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: "Ngày", value: timeLeft?.days ?? 0 },
    { label: "Giờ", value: timeLeft?.hours ?? 0 },
    { label: "Phút", value: timeLeft?.minutes ?? 0 },
    { label: "Giây", value: timeLeft?.seconds ?? 0 },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 sm:gap-10 max-w-lg mx-auto">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center border-t border-[rgba(27,52,36,0.16)] pt-4"
        >
          <span className="font-serif-display text-3xl sm:text-5xl font-light text-[#1B3424] tabular-nums">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#696D66]">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
