"use client";

import Link from "next/link";

export default function SalimComboBuilder() {
  return (
    <div className="rounded-[8px] border border-[#c0943e]/35 bg-[#fff8e7] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-2xl leading-none text-[#2f2110]">
          Build your wardrobe
        </p>
        <Link
          href="/build-your-wardrobe"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-[8px] bg-[#c0943e] px-4 text-xs font-bold uppercase tracking-[0.1em] text-black transition hover:bg-[#d2a64d]"
        >
          Choose More
        </Link>
      </div>
    </div>
  );
}

