"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, Zap, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const BOTTLE_TEMPLATES = [
  { id: "standard-bottle", name: "Standard Bottle", volume: "4ml", note: "Classic included bottle", image: "/standard bottle.png", price: 0, standard: true },
  { id: "bottle-1", name: "Small Bottle 1", volume: "10ml", note: "Ocean Breeze (Sea Salt & Citrus)", image: "/bottle1.jpeg" },
  { id: "bottle-2", name: "Small Bottle 2", volume: "10ml", note: "Velvet Rose (Taif Rose & Musk)", image: "/bottle2.jpeg" },
  { id: "bottle-3", name: "Small Bottle 3", volume: "10ml", note: "Sandal Gold (Mysore Sandal & Amber)", image: "/bottle3.jpeg" },
  { id: "bottle-4", name: "Small Bottle 4", volume: "10ml", note: "Royal Oudh (Cambodian Oud & Woods)", image: "/bottle4.jpeg" },
  { id: "bottle-5", name: "Small Bottle 5", volume: "10ml", note: "Saffron Touch (Spicy Saffron & Herbs)", image: "/bottle5.jpeg" },
  { id: "bottle-6", name: "Small Bottle 6", volume: "15ml", note: "Musk Supreme (Soft White Velvet Musk)", image: "/bottle6.jpeg" },
  { id: "bottle-7", name: "Small Bottle 7", volume: "15ml", note: "Amber Glow (Golden Amber & Labdanum)", image: "/bottle7.jpeg" },
  { id: "bottle-8", name: "Small Bottle 8", volume: "15ml", note: "Jasmine Noir (Night Jasmine & Vanilla)", image: "/bottle8.jpeg" },
  { id: "bottle-9", name: "Small Bottle 9", volume: "15ml", note: "Cedar Mist (Cedarwood & Green Vetiver)", image: "/bottle9.jpeg" },
  { id: "bottle-10", name: "Small Bottle 10", volume: "15ml", note: "Royal Spice (Cardamom & Warm Woods)", image: "/bottle10.jpeg" },
];

function isBottleAvailableForVolume(index: number, volume: ProductVolumeMl) {
  const bottle = BOTTLE_TEMPLATES[index];
  return Boolean(bottle?.standard) || bottle?.volume === getVolumeCartValue(volume);
}

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
  const [showAlternate, setShowAlternate] = useState(false);

  // Reset image view when product changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowAlternate(false);
  }, [product.id]);

  // Stable, deterministic prices generated based on the product ID to prevent hydration mismatches and layout shifts
  const bottlePrices = useMemo(() => {
    return BOTTLE_TEMPLATES.map((template, i) => {
      if (template.price !== undefined) {
        return template.price;
      }

      const seed = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const premiumBottleIndex = i - 1;
      return ((seed + premiumBottleIndex * 7) % 11) + 70;
    });
  }, [product.id]);
  
  // Selection state
  const [selectedBottleIndex, setSelectedBottleIndex] = useState<number | null>(null);

  // Upsell popup states
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [upsellActionType, setUpsellActionType] = useState<"cart" | "buy">("cart");
  const [tempSelectedIndex, setTempSelectedIndex] = useState<number | null>(null);
  const availableBottleTemplates = BOTTLE_TEMPLATES;

  // Listen to signature volume custom event from other elements if necessary
  useEffect(() => {
    const handleSignatureVolume = (e: Event) => {
      const customEvent = e as CustomEvent<ProductVolumeMl>;
      if (customEvent.detail && typeof customEvent.detail === "number" && customEvent.detail !== selectedVolume) {
        setSelectedVolume(customEvent.detail);
        setSelectedBottleIndex((index) =>
          index !== null && isBottleAvailableForVolume(index, customEvent.detail)
            ? index
            : null
        );
        setTempSelectedIndex((index) =>
          index !== null && isBottleAvailableForVolume(index, customEvent.detail)
            ? index
            : null
        );
      }
    };
    window.addEventListener("signature-volume-changed", handleSignatureVolume);
    return () => {
      window.removeEventListener("signature-volume-changed", handleSignatureVolume);
    };
  }, [selectedVolume]);

  const handleVolumeSelect = (volume: ProductVolumeMl) => {
    setSelectedVolume(volume);
    setSelectedBottleIndex((index) =>
      index !== null && isBottleAvailableForVolume(index, volume) ? index : null
    );
    setTempSelectedIndex((index) =>
      index !== null && isBottleAvailableForVolume(index, volume) ? index : null
    );
    window.dispatchEvent(new CustomEvent("product-volume-changed", { detail: volume }));
  };

  const handleSelectTempBottle = (index: number) => {
    if (tempSelectedIndex === index) {
      setTempSelectedIndex(null);
    } else {
      setTempSelectedIndex(index);
    }
  };

  const handleAddToCartClick = () => {
    setTempSelectedIndex(
      selectedBottleIndex !== null && isBottleAvailableForVolume(selectedBottleIndex, selectedVolume)
        ? selectedBottleIndex
        : null
    );
    setUpsellActionType("cart");
    setIsUpsellOpen(true);
  };

  const handleBuyNowClick = () => {
    setTempSelectedIndex(
      selectedBottleIndex !== null && isBottleAvailableForVolume(selectedBottleIndex, selectedVolume)
        ? selectedBottleIndex
        : null
    );
    setUpsellActionType("buy");
    setIsUpsellOpen(true);
  };

  const router = useRouter();
  const { addItem } = useCart();

  const price = isPremium ? 149 : getVolumePrice(selectedVolume, product.price);

  const regularPriceForVolume = getVolumePrice(selectedVolume, product.price);
  const discountPercent = isPremium
    ? Math.round(((regularPriceForVolume - 149) / regularPriceForVolume) * 100)
    : getProductDiscountPercent(product);
  const compareAtPrice = isPremium
    ? regularPriceForVolume
    : getCompareAtPrice(price, discountPercent);

  const selectedVolumeValue = getVolumeCartValue(selectedVolume);

  const addProductWithSelection = (chosenIndex: number | null, actionType: "cart" | "buy") => {
    const allowedChosenIndex =
      chosenIndex !== null && chosenIndex >= 0 && chosenIndex < availableBottleTemplates.length
        ? chosenIndex
        : null;

    if (allowedChosenIndex !== null) {
      const selectedBottle = availableBottleTemplates[allowedChosenIndex];
      const bottleVolume = selectedBottle.volume;
      const bottleVolumeMl = Number(bottleVolume.replace(/ml/i, ""));
      const bPrice = bottlePrices[allowedChosenIndex] || 0;
      const itemPrice = (isPremium ? 149 : getVolumePrice(bottleVolumeMl, product.price)) + bPrice;
      addItem({
        id: `${product.id}-${selectedBottle.id}-${bottleVolume}`,
        slug: product.slug,
        name: product.name, // Removed "(Signature Blend)" text
        image: product.image,
        price: itemPrice,
        quantity,
        // variant: `Bottle ${chosenIndex + 1} (${formatPrice(bPrice)})`, // Removed "Signature: " text
        variant: selectedBottle.name,
        volume: bottleVolume,
      });
      setSelectedBottleIndex(allowedChosenIndex);
      if (!selectedBottle.standard) {
        setSelectedVolume(bottleVolumeMl as ProductVolumeMl);
      }
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
      setSelectedBottleIndex(null);
    }

    if (actionType === "cart") {
      requestCartOpen();
    } else {
      router.push("/cart");
    }
    setIsUpsellOpen(false);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-7 sm:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start w-full text-left">
      {/* Left Column: Image */}
      <div className="space-y-5 sm:space-y-6 w-full">
        <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#120b08] shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
          <div
            onClick={() => {
              if (product.hoverImage) {
                setShowAlternate((prev) => !prev);
              }
            }}
            className="relative aspect-square group/image cursor-pointer touch-manipulation select-none"
          >
            {/* Primary Product Image */}
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              fetchPriority="high"
              loading="eager"
              decoding="async"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover transition-opacity duration-500 ${
                product.hoverImage
                  ? `md:group-hover/image:opacity-0 ${showAlternate ? "opacity-0" : "opacity-100"}`
                  : ""
              }`}
            />
            {/* Hover/Touch Product Image */}
            {product.hoverImage && (
              <Image
                src={product.hoverImage}
                alt={`${product.name} alternate view`}
                fill
                decoding="async"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover absolute inset-0 transition-opacity duration-500 md:group-hover/image:opacity-100 ${
                  showAlternate ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            {/* Mobile Image Indicator Dots */}
            {product.hoverImage && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden z-10 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAlternate(false);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    !showAlternate ? "w-4 bg-amber-300" : "w-1.5 bg-white/40"
                  }`}
                  aria-label="View main image"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAlternate(true);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    showAlternate ? "w-4 bg-amber-300" : "w-1.5 bg-white/40"
                  }`}
                  aria-label="View alternate image"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Details & Actions */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
                      {formatPrice(isPremium ? 149 : getVolumePrice(volume, product.price))}
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
            {formatPrice(price)}
          </span>
          {compareAtPrice > price && (
            <span className="font-sans text-base font-semibold leading-none text-zinc-500 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
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
            onClick={handleAddToCartClick}
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
            onClick={handleBuyNowClick}
            className="group flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-amber-400/20 bg-zinc-900/70 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800 active:translate-y-0 sm:h-11 sm:flex-1 sm:gap-2 sm:px-5 sm:text-sm sm:tracking-[0.12em]"
          >
            <Zap
              size={15}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            Buy Now
          </button>
        </div>
      </motion.div>

      {/* eCommerce Upsell Modal Popup */}
      <AnimatePresence>
        {isUpsellOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpsellOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog (Compact size: max-w-2xl, smaller paddings) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0a08]/95 p-5 shadow-2xl backdrop-blur-2xl md:p-7"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsUpsellOpen(false)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white transition duration-200"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Progress Indicator & Title (Compact typography) */}
              <div className="text-center space-y-1">
                <div className="mx-auto flex max-w-xs items-center gap-2 justify-center">
                  <div className="h-0.5 w-8 rounded bg-amber-400/80" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300">
                    Step 1 of 2: Customization
                  </span>
                  <div className="h-0.5 w-8 rounded bg-zinc-800" />
                </div>

                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white sm:text-2xl drop-shadow-[0_4px_12px_rgba(212,175,55,0.15)]">
                  Choose Your Preferred Bottle
                </h2>
                <p className="mx-auto max-w-md text-[11px] text-zinc-400">
                  Elevate your fragrance with our hand-crafted, luxury signature bottles. Select a bottle design below.
                </p>
              </div>

              {/* Swipeable Carousel of 7 Bottle Option Cards (Compact sizes: w-[125px], text sizes reduced) */}
              <div className="mt-6 flex gap-4 overflow-x-auto pb-5 pt-1 px-1 scrollbar-none snap-x snap-mandatory cursor-grab active:cursor-grabbing">
                {availableBottleTemplates.map((template, index) => {
                  const isSelected = tempSelectedIndex === index;
                  const bPrice = bottlePrices[index] || 0;

                  return (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTempBottle(index)}
                      className={`group relative snap-center shrink-0 w-[150px] md:w-[170px] cursor-pointer flex flex-col justify-between overflow-hidden rounded-lg p-3 border transition-all duration-300 select-none ${
                        isSelected
                          ? "border-[#D4AF37] bg-gradient-to-b from-[#D4AF37]/15 to-[#D4AF37]/0.02 shadow-[0_0_20px_rgba(212,175,55,0.22)] -translate-y-1 ring-2 ring-[#d4af37]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Glow ring effect under selected card */}
                      {isSelected && (
                        <div className="absolute inset-0 -z-10 bg-[#d4af37]/5 blur-md rounded-lg" />
                      )}

                      {/* Checkmark Indicator */}
                      <div className="absolute right-2 top-2 z-10 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#D4AF37]/40 transition duration-300 bg-black/60">
                        <div
                          className={`flex h-2.5 w-2.5 items-center justify-center rounded-full transition-all duration-300 ${
                            isSelected ? "bg-[#D4AF37] scale-100" : "bg-transparent scale-0"
                          }`}
                        >
                          {isSelected && <Check size={7} className="text-black stroke-[3]" />}
                        </div>
                      </div>

                      {/* Image */}
                      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-black/45">
                        <Image
                          src={template.image}
                          alt={template.name}
                          fill
                          decoding="async"
                          sizes="170px"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Bottle Details */}
                      <div className="mt-3 flex flex-col text-center">
                        <span className="font-sans text-[11px] font-bold text-white leading-tight">
                          {template.name}
                        </span>
                        <span className="mx-auto mt-1 rounded bg-amber-300/15 px-1.5 py-0.5 font-sans text-[8px] font-bold uppercase tracking-[0.08em] text-amber-200">
                          {template.volume}
                        </span>
                        <p className="mt-1 font-serif text-[9px] text-zinc-400 leading-tight line-clamp-2 min-h-[26px]">
                          {template.note}
                        </p>
                        <span className="mt-2 block font-sans text-[11px] font-bold text-[#D4AF37] leading-none">
                          +{formatPrice(bPrice)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress/Selection Dots Indicator */}
              <div className="mt-3 flex justify-center gap-1.5">
                {availableBottleTemplates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTempSelectedIndex(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      tempSelectedIndex === index ? "w-4 bg-amber-400" : "w-1 bg-zinc-800"
                    }`}
                    aria-label={`Select bottle ${index + 1}`}
                  />
                ))}
              </div>

              {/* Upsell Dialog Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => addProductWithSelection(tempSelectedIndex, upsellActionType)}
                  disabled={tempSelectedIndex === null}
                  className={`group flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-xs font-bold uppercase tracking-wider transition-all duration-300 sm:min-w-[200px] ${
                    tempSelectedIndex === null
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                      : "bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] text-black shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
                  }`}
                >
                  Continue with Selected Bottle
                </button>

                <button
                  type="button"
                  onClick={() => addProductWithSelection(null, upsellActionType)}
                  className="group flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-6 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05] active:translate-y-0 sm:min-w-[150px]"
                >
                  Skip & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
