"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SalimComboBuilder({
  onChooseMore,
}: {
  onChooseMore?: () => void;
}) {
  const { startWardrobeFlow } = useCart();

  return (
    <div className="rounded-[8px] border border-[#c0943e]/35 bg-[#fff8e7] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-xs font-semibold uppercase tracking-wider leading-none text-[#2f2110]">
          Build your wardrobe
        </p>
        <Link
          href="/build-your-wardrobe"
          onClick={() => {
            startWardrobeFlow({ source: "cart", minimumRequired: 2 });
            onChooseMore?.();
          }}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-[8px] bg-[#c0943e] px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-black transition hover:bg-[#d2a64d]"
        >
          <span className="flex flex-col items-center leading-tight">
            <span>Choose More</span>
            <span className="mt-0.5 text-[8px] normal-case tracking-[0.02em]">
              Minimum 2 products required
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

