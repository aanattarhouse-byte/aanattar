"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function AnimatedSignatureHeader() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const chars = headingRef.current.querySelectorAll(".char-span");

    // Timeline setup with loop repeat
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    // Initial setup state (hidden above viewport, blurred, transparent)
    tl.set(headingRef.current, { y: 0, opacity: 1 });
    tl.set(chars, { y: -150, opacity: 0, filter: "blur(12px)" });

    // 1. Drop down with character stagger and bounce landing
    tl.to(chars, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.9,
      stagger: 0.04, // Smooth letter-by-letter cascade
      ease: "back.out(1.6)",
    });

    // 2. Hold for 2 seconds
    tl.to({}, { duration: 2 });

    // 3. Entire heading slides down, blurs, and fades out
    tl.to(headingRef.current, {
      y: 80,
      opacity: 0,
      filter: "blur(12px)",
      duration: 0.8,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, []);

  const headingText = "Choose the attar that enters before you do.";
  const words = headingText.split(" ");

  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        Build Your Signature
      </p>
      
      {/* GSAP Animated Character-by-Character Gravity/Bounce Heading */}
      <h1
        ref={headingRef}
        className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl font-display font-semibold text-white drop-shadow-[0_8px_34px_rgba(255,179,71,0.18)] flex flex-wrap gap-x-[0.25em] min-h-[3.6rem]"
      >
        {words.map((word, wIndex) => (
          <span
            key={wIndex}
            className="word-span inline-block whitespace-nowrap"
          >
            {word.split("").map((char, cIndex) => (
              <span
                key={cIndex}
                className="char-span inline-block opacity-0"
                style={{ display: "inline-block" }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <p className="mt-4 max-w-xl text-sm text-zinc-300 md:text-base">
        Explore the full Aan Attar collection, from royal oudh
        blends to clean musks, botanical florals, and modern elite
        inspirations.
      </p>
      
      <Link
        href="/build-your-wardrobe"
        className="mt-6 inline-flex h-10 items-center rounded-[8px] border border-amber-300/40 bg-white/5 px-5 text-xs font-bold uppercase tracking-[0.1em] text-amber-100 transition hover:bg-amber-300 hover:text-black"
      >
        Build Your Wardrobe
      </Link>
    </div>
  );
}
