"use client";

import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import SearchPopup, { type SearchPopupIcon } from "@/components/SearchPopup";

export default function SearchBar({
  id,
  label,
  value,
  placeholder,
  popupOpen,
  suggestions,
  highlightedIndex,
  popupIcon,
  onChange,
  onFocus,
  onKeyDown,
  onSelect,
  onHighlight,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  popupOpen: boolean;
  suggestions: string[];
  highlightedIndex: number;
  popupIcon: SearchPopupIcon;
  onChange: (value: string) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (value: string) => void;
  onHighlight: (index: number) => void;
}) {
  const popupId = `${id}-popup`;
  const Icon = popupIcon === "sparkles" ? Sparkles : Search;
  const activeDescendantIndex =
    suggestions.length && highlightedIndex >= 0
      ? Math.min(highlightedIndex, suggestions.length - 1)
      : -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#d4a24c]"
        />
        <input
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={popupOpen}
          aria-controls={popupId}
          aria-activedescendant={
            popupOpen && activeDescendantIndex >= 0 ? `${popupId}-${activeDescendantIndex}` : undefined
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="h-16 w-full rounded-[24px] border border-[#d4a24c]/35 bg-white/[0.08] pl-14 pr-5 text-base font-semibold text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] outline-none backdrop-blur-xl transition placeholder:text-zinc-500 focus:border-[#f5d28a] focus:bg-white/[0.11] focus:ring-4 focus:ring-[#d4a24c]/15 sm:h-20 sm:text-lg"
        />
      </div>

      <SearchPopup
        id={popupId}
        open={popupOpen}
        suggestions={suggestions}
        highlightedIndex={highlightedIndex}
        icon={popupIcon}
        onSelect={onSelect}
        onHighlight={onHighlight}
      />
    </motion.div>
  );
}
