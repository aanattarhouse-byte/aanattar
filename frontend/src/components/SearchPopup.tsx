"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

export type SearchPopupIcon = "search" | "sparkles";

export default function SearchPopup({
  id,
  open,
  suggestions,
  highlightedIndex,
  icon = "search",
  onSelect,
  onHighlight,
}: {
  id: string;
  open: boolean;
  suggestions: string[];
  highlightedIndex: number;
  icon?: SearchPopupIcon;
  onSelect: (value: string) => void;
  onHighlight: (index: number) => void;
}) {
  const Icon = icon === "sparkles" ? Sparkles : Search;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={id}
          role="listbox"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 max-h-72 overflow-y-auto rounded-[20px] border border-white/35 bg-white/80 p-2 text-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
        >
          {suggestions.length ? (
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                id={`${id}-${index}`}
                type="button"
                role="option"
                aria-selected={highlightedIndex === index}
                onMouseEnter={() => onHighlight(index)}
                onClick={() => onSelect(suggestion)}
                className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-base font-semibold transition ${
                  highlightedIndex === index
                    ? "bg-black text-[#f5d28a] shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
                    : "text-zinc-800 hover:bg-black/8"
                }`}
              >
                <Icon
                  aria-hidden
                  size={18}
                  className={highlightedIndex === index ? "text-[#f5d28a]" : "text-[#9a6a1e]"}
                />
                <span>{suggestion}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-5 text-sm font-medium text-zinc-600">
              No suggestions found.
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
