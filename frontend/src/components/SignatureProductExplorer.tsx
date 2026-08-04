"use client";

import { useState } from "react";
import AnimatedSignatureHeader from "@/components/AnimatedSignatureHeader";
import ProductGrid from "@/components/ProductGrid";
import type { ProductCardDetailMode } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

const tabs: { label: string; value: ProductCardDetailMode }[] = [
  { label: "Notes", value: "notes" },
  { label: "Occasion", value: "occasion" },
];

export default function SignatureProductExplorer({
  products,
}: {
  products: Product[];
}) {
  const [activeTab, setActiveTab] = useState<ProductCardDetailMode>("notes");

  return (
    <div className="mx-auto max-w-7xl relative z-10">
      <div className="mb-6 flex justify-center sm:justify-start">
        <div
          role="tablist"
          aria-label="Choose product detail"
          className="inline-flex overflow-hidden rounded-[8px] bg-white p-1 text-black shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`h-10 px-5 text-xl font-medium leading-none transition sm:h-9 sm:text-base ${
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

      <AnimatedSignatureHeader />

      <div className="mt-9">
        <ProductGrid
          products={products}
          compact
          hideAddToCart
          detailMode={activeTab}
        />
      </div>
    </div>
  );
}
