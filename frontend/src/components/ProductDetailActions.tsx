"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Zap, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { requestCartOpen } from "@/lib/cart";
import {
  formatPrice,
  getCompareAtPrice,
  getProductDiscountPercent,
  type Product,
} from "@/lib/products";
import {
  DEFAULT_PRODUCT_VOLUME_ML,
  PRODUCT_VOLUME_OPTIONS,
  formatVolume,
  getVolumeCartValue,
  getVolumePrice,
  type ProductVolumeMl,
} from "@/lib/productVolume";
import ScrollReveal from "@/components/ScrollReveal";

// Define the 7 bottles and their descriptions
const BOTTLE_TEMPLATES = [
  { id: "bottle-1", name: "Bottle 1", note: "Ocean Breeze (Sea Salt & Citrus)", image: "/bottle1.jpg" },
  { id: "bottle-2", name: "Bottle 2", note: "Velvet Rose (Taif Rose & Musk)", image: "/bottle2.jpg" },
  { id: "bottle-3", name: "Bottle 3", note: "Sandal Gold (Mysore Sandal & Amber)", image: "/bottle3.jpg" },
  { id: "bottle-4", name: "Bottle 4", note: "Royal Oudh (Cambodian Oud & Woods)", image: "/bottle4.jpg" },
  { id: "bottle-5", name: "Bottle 5", note: "Saffron Touch (Spicy Saffron & Herbs)", image: "/bottle5.jpg" },
  { id: "bottle-6", name: "Bottle 6", note: "Musk Supreme (Soft White Velvet Musk)", image: "/bottle6.jpg" },
  { id: "bottle-7", name: "Bottle 7", note: "Amber Glow (Golden Amber & Labdanum)", image: "/bottle7.jpg" },
];

export default function ProductDetailActions({
  product,
  isPremium = false,
}: {
  product: Product;
  isPremium?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState<ProductVolumeMl>(
    DEFAULT_PRODUCT_VOLUME_ML
  );

  // Stable, deterministic prices generated based on the product ID to prevent hydration mismatches and layout shifts
  const bottlePrices = useMemo(() => {
    return BOTTLE_TEMPLATES.map((_, i) => {
      const seed = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return ((seed + i * 7) % 21) + 60; // stable integer price between 60 and 80
    });
  }, [product.id]);
  
  // Selection state (default selects empty so user can buy plain product, but if they click one, it builds signature)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Listen to signature volume custom event from other elements if necessary
  useEffect(() => {
    const handleSignatureVolume = (e: Event) => {
      const customEvent = e as CustomEvent<ProductVolumeMl>;
      if (customEvent.detail && typeof customEvent.detail === "number" && customEvent.detail !== selectedVolume) {
        setSelectedVolume(customEvent.detail);
      }
    };
    window.addEventListener("signature-volume-changed", handleSignatureVolume);
    return () => {
      window.removeEventListener("signature-volume-changed", handleSignatureVolume);
    };
  }, [selectedVolume]);



  const handleVolumeSelect = (volume: ProductVolumeMl) => {
    setSelectedVolume(volume);
    window.dispatchEvent(new CustomEvent("product-volume-changed", { detail: volume }));
  };

  const handleToggleBottle = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices([index]);
    }
  };

  const router = useRouter();
  const { addItem } = useCart();

  const price = isPremium ? 149 : getVolumePrice(selectedVolume, product.price);
  
  // Extra cost of selected bottles
  const extraCost = useMemo(() => {
    if (bottlePrices.length === 0) return 0;
    return selectedIndices.reduce((sum, idx) => sum + (bottlePrices[idx] || 0), 0);
  }, [selectedIndices, bottlePrices]);

  // Grand total
  const grandTotal = price + extraCost;

  const currentDisplayPrice = grandTotal;

  const regularPriceForVolume = getVolumePrice(selectedVolume, product.price);
  const discountPercent = isPremium
    ? Math.round(((regularPriceForVolume - 149) / regularPriceForVolume) * 100)
    : getProductDiscountPercent(product);
  const baseCompareAtPrice = isPremium
    ? regularPriceForVolume
    : getCompareAtPrice(price, discountPercent);
  const currentCompareAtPrice = baseCompareAtPrice + extraCost;

  const selectedVolumeValue = getVolumeCartValue(selectedVolume);

  const addProduct = () => {
    if (selectedIndices.length > 0) {
      const selectedBottlesText = selectedIndices
        .map((idx) => `Bottle ${idx + 1} (₹${bottlePrices[idx]})`)
        .join(", ");

      addItem({
        id: `${product.id}-signature-${selectedIndices.sort().join("-")}-${selectedVolume}`,
        slug: product.slug,
        name: `${product.name} (Signature Blend)`,
        image: product.image,
        price: grandTotal,
        quantity,
        variant: `Signature: ${selectedBottlesText}`,
        volume: selectedVolumeValue,
      });
    } else {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price,
        quantity,
        variant: isPremium ? "Premium Collection" : undefined,
        volume: selectedVolumeValue,
      });
    }
  };

  const addProductAndShowCart = () => {
    addProduct();
    requestCartOpen();
  };

  const buyNow = () => {
    addProduct();
    router.push("/cart");
  };



  const renderCard = (index: number) => {
    const template = BOTTLE_TEMPLATES[index];
    const isSelected = selectedIndices.includes(index);
    const bPrice = bottlePrices[index] || 0;

    return (
      <div
        key={template.id}
        onClick={() => handleToggleBottle(index)}
        className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-[8px] p-2 transition-all duration-300 select-none ${
          isSelected
            ? "border border-[#D4AF37] bg-gradient-to-b from-[#D4AF37]/10 to-[#D4AF37]/0.01 shadow-[0_6px_16px_rgba(212,175,55,0.12)]"
            : "border border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        }`}
      >
        {/* Selection Indicator */}
        <div className="absolute right-1.5 top-1.5 z-10 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#D4AF37]/40 transition duration-300">
          <div
            className={`flex h-2.5 w-2.5 items-center justify-center rounded-full transition-all duration-300 ${
              isSelected ? "bg-[#D4AF37] scale-100" : "bg-transparent scale-0"
            }`}
          >
            {isSelected && <Check size={7} className="text-black stroke-[3]" />}
          </div>
        </div>

        {/* Small Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[4px] bg-black/45">
          <Image
            src={template.image}
            alt={template.name}
            fill
            sizes="80px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="mt-1.5 flex flex-col text-center">
          <span className="font-sans text-[10px] font-bold text-white leading-none">
            {template.name}
          </span>
          <p className="mt-0.5 font-serif text-[8px] text-zinc-400 leading-tight line-clamp-1">
            {template.note}
          </p>
          <span className="mt-1 block font-sans text-[10px] font-bold text-[#D4AF37] leading-none">
            {formatPrice(bPrice)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-7 sm:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start w-full text-left">
      {/* Left Column: Image & Signature Blend Section */}
      <div className="space-y-5 sm:space-y-6 w-full">
        <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#120b08] shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Signature Blend Section */}
        <div className="border-t border-white/10 pt-4 space-y-2.5">

          {/* Desktop / Tablet Grid: 4 + 3 Layout */}
          <div className="hidden sm:flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((index) => renderCard(index))}
            </div>
            <div className="grid grid-cols-3 gap-2 max-w-[75%] mx-auto w-full">
              {[4, 5, 6].map((index) => renderCard(index))}
            </div>
          </div>

          {/* Mobile Grid: 2 Columns */}
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            {BOTTLE_TEMPLATES.map((_, index) => renderCard(index))}
          </div>
        </div>
      </div>

      {/* Right Column: Details & Actions */}
      <ScrollReveal className="w-full">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-sm sm:tracking-[0.24em]">
          {product.category}
        </p>
        <h1 className="mt-3 text-4xl leading-none sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
          {product.name}
        </h1>
        <p className="mt-4 text-base text-zinc-300 sm:mt-6 sm:text-lg">
          {product.description}
        </p>

        <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-amber-200 sm:text-sm sm:tracking-[0.18em]">
              Vibe
            </p>
            <p className="mt-2 text-sm text-zinc-200 sm:mt-3 sm:text-base">
              {product.vibe}
            </p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-amber-200 sm:text-sm sm:tracking-[0.18em]">
              Best For
            </p>
            <p className="mt-2 text-sm text-zinc-200 sm:mt-3 sm:text-base">
              {product.bestFor}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-4 sm:mt-6 sm:p-5">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-amber-200 sm:text-sm sm:tracking-[0.18em]">
            Fragrance Notes
          </p>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {product.notes.map((note: string) => (
              <span
                key={note}
                className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs text-amber-100 sm:px-3 sm:text-sm"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Volume Selector */}
        <div className="mt-6 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:text-xs sm:tracking-[0.2em]">
            Volume
          </span>
          {isPremium ? (
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-amber-300/30 bg-amber-300/10 px-4 py-2.5">
              <span className="block font-sans text-sm font-bold text-white">
                {formatVolume(selectedVolume)}
              </span>
              <span className="h-4 w-[1px] bg-amber-300/30" />
              <span className="block font-sans text-xs font-bold uppercase tracking-[0.1em] text-amber-300">
                Premium Collection Offer
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {PRODUCT_VOLUME_OPTIONS.map((volume) => {
                const selected = selectedVolume === volume;

                return (
                  <button
                    key={volume}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleVolumeSelect(volume)}
                    className={`min-w-[92px] rounded-[8px] border px-3 py-2 text-left transition-all duration-200 sm:min-w-[108px] ${
                      selected
                        ? "border-amber-300/70 bg-amber-300/15 shadow-[0_0_0_1px_rgba(248,220,123,0.18)]"
                        : "border-white/10 bg-white/[0.04] hover:border-amber-300/30 hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="block font-sans text-sm font-bold text-white">
                      {formatVolume(volume)}
                    </span>
                    <span className="mt-1 block font-sans text-xs font-semibold text-amber-200">
                      {formatPrice(getVolumePrice(volume, product.price))}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Price Display */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-sans text-2xl font-bold leading-none text-amber-200">
            {formatPrice(currentDisplayPrice)}
          </span>
          <span className="font-sans text-base font-semibold leading-none text-zinc-500 line-through">
            {formatPrice(currentCompareAtPrice)}
          </span>
          <span className="rounded-[3px] bg-emerald-600 px-2 py-1 font-sans text-xs font-bold leading-none text-white">
            {discountPercent}% off
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="mt-6 flex items-center justify-between gap-3 sm:justify-start">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:text-xs sm:tracking-[0.2em]">
            Quantity
          </span>

          <div className="flex items-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex h-9 w-9 items-center justify-center text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white sm:h-10 sm:w-10"
            >
              <Minus size={14} />
            </button>

            <span className="flex h-9 min-w-10 items-center justify-center border-x border-zinc-800 px-2 text-sm font-semibold text-white sm:h-10 sm:min-w-12 sm:px-3">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((value) => value + 1)}
              className="flex h-9 w-9 items-center justify-center text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white sm:h-10 sm:w-10"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <button
            type="button"
            onClick={addProductAndShowCart}
            className="group flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:h-11 sm:flex-1 sm:gap-2 sm:px-5 sm:text-sm sm:tracking-[0.12em]"
          >
            <ShoppingCart
              size={15}
              strokeWidth={2.4}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            Add to Cart
          </button>

          <button
            type="button"
            onClick={buyNow}
            className="group flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-amber-400/20 bg-zinc-900/70 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800 active:translate-y-0 sm:h-11 sm:flex-1 sm:gap-2 sm:px-5 sm:text-sm sm:tracking-[0.12em]"
          >
            <Zap
              size={15}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            Buy Now
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}
