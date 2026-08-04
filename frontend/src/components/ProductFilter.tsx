"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedSignatureHeader from "@/components/AnimatedSignatureHeader";
import EmptyState from "@/components/EmptyState";
import NoteChip from "@/components/NoteChip";
import OccasionChip from "@/components/OccasionChip";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import type { ProductCardDetailMode } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

const noteChips = [
  "Oud",
  "Rose",
  "Musk",
  "Vanilla",
  "Amber",
  "Sandalwood",
  "Citrus",
  "Leather",
  "Jasmine",
  "Lavender",
];

const occasionChips = [
  "Daily Wear",
  "Office",
  "Wedding",
  "Date Night",
  "Ramadan",
  "Eid",
  "Party",
  "Travel",
  "Gym",
  "Summer",
  "Winter",
  "Luxury",
  "Formal",
  "Casual",
];

const noteAliases = [
  "White Oud",
  "Royal Oud",
  "Oud & Rose",
  "Oud + Musk",
  "Soft Musk",
  "White Musk",
  "Warm Amber",
  "Dark Woods",
];

const occasionAliases = [
  "Wedding Night",
  "Wedding Guest",
  "Evening",
  "Dinner",
  "Boardroom",
  "Traditional",
  "Big Moments",
];

const tabs: { label: string; value: ProductCardDetailMode }[] = [
  { label: "Notes", value: "notes" },
  { label: "Occasion", value: "occasion" },
];

function normalize(value: string) {
  return value.toLowerCase().replace(/oudh/g, "oud").replace(/[^a-z0-9]+/g, " ").trim();
}

function unique(values: string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalize(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getSearchTerms(value: string) {
  if (/[&+]/.test(value)) {
    return value.split(/[&+]/).map(normalize).filter(Boolean);
  }

  const normalized = normalize(value);
  if (!normalized) return [];

  if (normalized.includes(" and ")) {
    return normalized.split(" and ").map((term) => term.trim()).filter(Boolean);
  }

  return [normalized];
}

function metadataMatches(values: string[], query: string) {
  const terms = getSearchTerms(query);
  if (!terms.length) return false;

  const normalizedValues = values.map(normalize);
  return terms.every((term) =>
    normalizedValues.some((value) => value.includes(term) || term.includes(value))
  );
}

function useDebouncedValue(value: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

export default function ProductFilter({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<ProductCardDetailMode>("notes");
  const [inputValue, setInputValue] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debouncedInput = useDebouncedValue(inputValue);

  const noteSuggestions = useMemo(
    () => unique([...noteChips, ...noteAliases, ...products.flatMap((product) => product.notes)]),
    [products]
  );

  const occasionSuggestions = useMemo(
    () =>
      unique([
        ...occasionChips,
        ...occasionAliases,
        ...products.flatMap((product) => product.occasions ?? []),
      ]),
    [products]
  );

  const allSuggestions = activeTab === "notes" ? noteSuggestions : occasionSuggestions;
  const popularChips = activeTab === "notes" ? noteChips : occasionChips;

  const filteredSuggestions = useMemo(() => {
    const needle = normalize(debouncedInput);
    const source = allSuggestions;
    if (!needle) return source.slice(0, 8);

    return source
      .filter((suggestion) => normalize(suggestion).includes(needle))
      .slice(0, 8);
  }, [allSuggestions, debouncedInput]);

  const displayedProducts = useMemo(() => {
    if (!committedQuery) return products;

    return products.filter((product) => {
      const metadata = activeTab === "notes" ? product.notes : product.occasions ?? [];
      return metadataMatches(metadata, committedQuery);
    });
  }, [activeTab, committedQuery, products]);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
    setHighlightedIndex(0);
  }, []);

  const commitSearch = useCallback(
    (value: string) => {
      const nextValue = value.trim();
      if (!nextValue) return;

      setInputValue(nextValue);
      setCommittedQuery(nextValue);
      closePopup();

      window.requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [closePopup]
  );

  const clearSearch = useCallback(() => {
    setInputValue("");
    setCommittedQuery("");
    closePopup();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [closePopup]);

  const handleTabChange = (value: ProductCardDetailMode) => {
    setActiveTab(value);
    setInputValue("");
    setCommittedQuery("");
    closePopup();
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setPopupOpen(true);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      closePopup();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setPopupOpen(true);
      setHighlightedIndex((current) =>
        filteredSuggestions.length ? (current + 1) % filteredSuggestions.length : 0
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setPopupOpen(true);
      setHighlightedIndex((current) =>
        filteredSuggestions.length
          ? (current - 1 + filteredSuggestions.length) % filteredSuggestions.length
          : 0
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedIndex = Math.min(highlightedIndex, filteredSuggestions.length - 1);
      commitSearch(filteredSuggestions[selectedIndex] ?? inputValue);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closePopup]);

  return (
    <div className="mx-auto max-w-7xl relative z-10">
      <div ref={searchRef} className="sticky top-20 z-40 -mx-4 mb-9 px-4 pt-2 sm:static sm:mx-0 sm:px-0 sm:pt-0">
        <div className="rounded-[28px] border border-white/10 bg-black/40 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          <div className="mb-5 flex justify-center">
            <div
              role="tablist"
              aria-label="Choose fragrance filter"
              className="inline-flex overflow-hidden rounded-full border border-[#d4a24c]/35 bg-white p-1 text-black shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`h-11 px-6 text-xl font-medium leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d28a] sm:h-10 sm:text-base ${
                    activeTab === tab.value
                      ? "text-black"
                      : "text-zinc-500 hover:text-black"
                  } ${index > 0 ? "border-l border-black/25" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <SearchBar
            id={`signature-${activeTab}-search`}
            label={activeTab === "notes" ? "Search fragrance notes" : "Search by occasion"}
            value={inputValue}
            placeholder={
              activeTab === "notes"
                ? "Search fragrance notes (e.g. Oud, Rose, Vanilla, Musk, Amber, Sandalwood...)"
                : "Search by occasion..."
            }
            popupOpen={popupOpen}
            suggestions={filteredSuggestions}
            highlightedIndex={highlightedIndex}
            popupIcon={activeTab === "notes" ? "search" : "sparkles"}
            onChange={handleInputChange}
            onFocus={() => setPopupOpen(true)}
            onKeyDown={handleKeyDown}
            onSelect={commitSearch}
            onHighlight={setHighlightedIndex}
          />

          <div
            aria-label={activeTab === "notes" ? "Popular fragrance notes" : "Popular occasions"}
            className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2"
          >
            {popularChips.map((chip) =>
              activeTab === "notes" ? (
                <NoteChip key={chip} label={chip} onClick={commitSearch} />
              ) : (
                <OccasionChip key={chip} label={chip} onClick={commitSearch} />
              )
            )}
          </div>
        </div>
      </div>

      <AnimatedSignatureHeader />

      <div ref={resultsRef} className="mt-9 scroll-mt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${committedQuery || "all"}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d4a24c]">
                  {activeTab === "notes" ? "Fragrance Notes" : "Occasion Match"}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
                  {committedQuery ? (
                    <>Results for &quot;{committedQuery}&quot;</>
                  ) : (
                    "All signature attars"
                  )}
                </h2>
              </div>
              <p className="text-sm font-semibold text-zinc-400">
                {displayedProducts.length} product{displayedProducts.length === 1 ? "" : "s"}
              </p>
            </div>

            {displayedProducts.length ? (
              <ProductGrid
                products={displayedProducts}
                compact
                hideAddToCart
                detailMode={activeTab}
                animated
              />
            ) : (
              <EmptyState onClear={clearSearch} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
