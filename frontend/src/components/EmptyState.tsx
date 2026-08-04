"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export default function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center"
    >
      <div className="relative grid h-28 w-28 place-items-center rounded-full border border-[#d4a24c]/35 bg-[radial-gradient(circle,rgba(245,210,138,0.18),rgba(255,255,255,0.03)_58%,rgba(0,0,0,0.2))] shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <SearchX aria-hidden size={42} className="text-[#f5d28a]" />
      </div>

      <h2 className="mt-7 font-display text-3xl font-semibold text-white">
        No fragrances found.
      </h2>

      <button
        type="button"
        onClick={onClear}
        className="mt-7 inline-flex h-12 items-center justify-center rounded-full border border-[#d4a24c]/60 bg-white/[0.05] px-7 text-xs font-bold uppercase tracking-[0.18em] text-[#f5d28a] transition hover:bg-[#f5d28a] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d28a]"
      >
        Clear Search
      </button>
    </motion.div>
  );
}
