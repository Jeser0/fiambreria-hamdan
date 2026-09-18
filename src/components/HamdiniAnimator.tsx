"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const frames = Array.from(
  { length: 7 },
  (_, index) => `/brand/hamdini-frames/hamdini-frame-${String(index + 1).padStart(2, "0")}.webp`,
);

const frameDurations = [120, 100, 95, 140, 125, 110, 190];

export default function HamdiniAnimator() {
  const [activeFrame, setActiveFrame] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const play = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveFrame(6);
      return;
    }

    clearTimers();
    setIsPlaying(true);
    setActiveFrame(0);

    let elapsed = 0;
    for (let index = 1; index < frames.length; index += 1) {
      elapsed += frameDurations[index - 1];
      const timer = window.setTimeout(() => {
        setActiveFrame(index);
      }, elapsed);
      timersRef.current.push(timer);
    }

    elapsed += frameDurations[frameDurations.length - 1];
    timersRef.current.push(
      window.setTimeout(() => {
        setActiveFrame(6);
        setIsPlaying(false);
      }, elapsed),
    );
  }, [clearTimers]);

  useEffect(() => {
    const startTimer = window.setTimeout(play, 240);
    return () => {
      window.clearTimeout(startTimer);
      clearTimers();
    };
  }, [clearTimers, play]);

  return (
    <button
      type="button"
      onClick={() => {
        if (!isPlaying) play();
      }}
      className="hamdini-frame-player group relative block w-full cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7a13a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff9ed]"
      aria-label="Hacer magia con Hamdini"
      title="Tocá a Hamdini para repetir la magia"
    >
      <span className="relative block aspect-square w-full" aria-hidden="true">
        {frames.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="(max-width: 1024px) 84vw, 440px"
            loading="eager"
            className={`object-contain transition-opacity duration-75 ${
              activeFrame === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </span>
      <span className="pointer-events-none absolute bottom-[9%] right-[8%] rounded-full border border-[#d8b461]/45 bg-[#fff8dd]/88 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#7e5524] opacity-0 shadow-sm transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        Tocame ✦
      </span>
    </button>
  );
}
