"use client";

import { motion } from "framer-motion";

export default function OccasionChip({
  label,
  onClick,
}: {
  label: string;
  onClick: (label: string) => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(label)}
      className="shrink-0 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition hover:border-[#f5d28a] hover:bg-[#f5d28a] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d28a]"
    >
      {label}
    </motion.button>
  );
}
