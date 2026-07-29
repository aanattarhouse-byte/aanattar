"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Check,
  Star,
  Award,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Play,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { requestCartOpen } from "@/lib/cart";
import {
  getProductBySlug,
  formatPrice,
  getCompareAtPrice,
  getProductDiscountPercent,
} from "@/lib/products";
import { getSalimComboState, salimComboConfig } from "@/lib/salimCombo";
import ProductReviews from "@/components/ProductReviews";

export default function SalimDetailsClient() {
  const router = useRouter();
  const { addItem } = useCart();
  const salimProduct = getProductBySlug("salim-luxury-attar");

  const [activeImage, setActiveImage] = useState("/salim1.jpg");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});

  if (!salimProduct) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0b0b] text-white">
        <p className="text-xl font-bold uppercase tracking-wider text-amber-300">
          Product Not Found
        </p>
        <Link
          href="/build-your-signature"
          className="mt-5 rounded-lg bg-amber-400 px-5 py-2 text-sm font-bold text-black"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const basePrice = salimProduct.price;
  const discountPercent = getProductDiscountPercent(salimProduct);
  const compareAtPrice = getCompareAtPrice(basePrice, discountPercent);
  const galleryMedia = Array.from(
    new Set(
      [
        salimProduct.image,
        salimProduct.hoverImage,
        "/salim4.jpeg",
        "/salim5.mp4",
        "/salim6.mp4",
      ].filter(Boolean)
    )
  ) as string[];
  const displayedActiveImage = galleryMedia.includes(activeImage)
    ? activeImage
    : galleryMedia[0];
  const activeMediaIsVideo = displayedActiveImage.endsWith(".mp4");

  // Toggle add-on selection
  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const isCurrentlySelected = !!prev[id];
      const selectedCount = Object.values(prev).filter(Boolean).length;
      
      // Limit to maximum of 2 selected mini attars
      if (!isCurrentlySelected && selectedCount >= 2) {
        return prev;
      }
      
      return {
        ...prev,
        [id]: !isCurrentlySelected,
      };
    });
  };

  // Mock cart items list to feed into getSalimComboState
  const mockItems = [
    {
      id: salimProduct.id,
      slug: salimProduct.slug,
      name: salimProduct.name,
      image: salimProduct.image,
      price: salimProduct.price,
      quantity: quantity,
    },
    ...salimComboConfig.addOns
      .filter((addOn) => selectedAddOns[addOn.id])
      .map((addOn) => ({
        id: addOn.id,
        name: addOn.name,
        image: addOn.image,
        price: addOn.price,
        quantity: quantity,
        variant: "Salim Combo",
        volume: addOn.size.toLowerCase(),
      })),
  ];

  const comboState = getSalimComboState(mockItems);

  const selectedMinis = salimComboConfig.addOns.filter(
    (addOn) => selectedAddOns[addOn.id]
  );
  const selectedCount = selectedMinis.length;

  // Add selected products to cart
  const handleAddToCart = (buyNow = false) => {
    const selectedIds = salimComboConfig.addOns
      .filter((addOn) => selectedAddOns[addOn.id])
      .map((addOn) => addOn.id);

    addItem(
      {
        id: salimProduct.id,
        slug: salimProduct.slug,
        name: salimProduct.name,
        image: salimProduct.image,
        price: salimProduct.price,
        quantity: quantity,
      },
      selectedIds
    );

    if (buyNow) {
      router.push("/cart");
    } else {
      requestCartOpen();
    }
  };

  return (
    <main className="w-full max-w-full overflow-x-hidden bg-[#0b0b0b] pb-16 font-sans text-white md:pb-0">
      {/* Hero section */}
      <section className="w-full max-w-full overflow-x-hidden px-0 py-0 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-5 sm:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          
          {/* Gallery component */}
          <div className="w-full min-w-0 space-y-2 sm:space-y-4">
            <div className="relative h-[100vw] sm:aspect-square sm:h-auto sm:rounded-[8px] sm:border sm:border-white/10 sm:bg-[#120b08] sm:shadow-[0_30px_90px_rgba(0,0,0,0.32)] overflow-hidden bg-white">
              {activeMediaIsVideo ? (
                <video
                  key={displayedActiveImage}
                  src={displayedActiveImage}
                  className="h-full w-full object-contain transition-all duration-700 hover:scale-105 sm:object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <Image
                  key={displayedActiveImage}
                  src={displayedActiveImage}
                  alt="Salim Luxury Attar main view"
                  fill
                  priority
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain transition-all duration-700 hover:scale-105 sm:object-cover"
                />
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex w-full gap-2 overflow-x-auto px-2 sm:max-w-none sm:gap-4 sm:overflow-visible sm:px-0">
              {galleryMedia.map((img, i) => {
                const isActive = displayedActiveImage === img;
                const isVideo = img.endsWith(".mp4");
                return (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-16 overflow-hidden rounded-[6px] border bg-[#120b08] transition-all duration-300 sm:w-24 ${
                      isActive ? "border-amber-300 ring-1 ring-amber-300/30" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {isVideo ? (
                      <div className="relative w-full h-full">
                        <video
                          src={img}
                          className="h-full w-full object-contain sm:object-cover"
                          muted
                          playsInline
                          preload="none"
                          poster={i === 3 ? "/salim1.jpg" : "/salim2.jpg"}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-[2px]">
                            <Play size={10} fill="currentColor" className="ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={img}
                        alt={`Salim Luxury Attar view ${i + 1}`}
                        fill
                        decoding="async"
                        sizes="96px"
                        className="object-contain sm:object-cover"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details & Actions */}
          <div className="w-full min-w-0 px-3 pb-5 sm:px-0 sm:pb-0">
              {/* Premium Tag */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                <Sparkles size={12} className="text-amber-300" />
                Signature Classics
              </span>

              {/* Title & Ratings */}
              <h1 className="mt-3 max-w-full break-words font-display text-[2rem] font-bold leading-tight text-white sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
                {salimProduct.name}
              </h1>

              {/* Quick Stars */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex shrink-0 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-zinc-400">
                  4.8 / 5.0 (3 verified reviews)
                </span>
              </div>

              {/* Short Description */}
              <p className="mt-4 max-w-full break-words text-sm leading-relaxed text-zinc-300 sm:mt-5 sm:text-lg">
                {salimProduct.description}
              </p>

              {/* Size Selector */}
              <div className="mt-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Volume / Size
                </span>
                <div className="flex max-w-full">
                  <div className="max-w-full rounded-[8px] border border-amber-300/70 bg-amber-300/15 px-4 py-3 text-left shadow-[0_0_0_1px_rgba(248,220,123,0.18)] sm:px-5">
                    <span className="block font-sans text-sm font-bold text-white">
                      12 ML (Signature)
                    </span>
                    <span className="mt-1 block font-sans text-xs font-semibold text-amber-200">
                      Standard size bottle
                    </span>
                  </div>
                </div>
              </div>

              {/* Base Pricing */}
              <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-sans text-2xl font-bold text-amber-200 sm:text-3xl">
                  {formatPrice(basePrice)}
                </span>
                <span className="font-sans text-base font-semibold text-zinc-500 line-through sm:text-lg">
                  {formatPrice(compareAtPrice)}
                </span>
                <span className="rounded-[3px] bg-emerald-600 px-2 py-1 font-sans text-xs font-bold text-white">
                  {discountPercent}% OFF
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center justify-between gap-4 sm:justify-start">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Quantity
                </span>
                <div className="flex items-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                    className="flex h-10 w-10 items-center justify-center text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex h-10 min-w-12 items-center justify-center border-x border-zinc-800 px-2 text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((v) => v + 1)}
                    className="flex h-10 w-10 items-center justify-center text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-7 grid grid-cols-1 gap-2 sm:mt-8 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="group flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] px-3 text-[11px] font-bold uppercase tracking-[0.06em] text-black shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:h-12 sm:gap-2 sm:px-5 sm:text-xs sm:tracking-[0.14em]"
                >
                  <ShoppingCart size={16} strokeWidth={2.4} />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="group flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-amber-400/20 bg-zinc-900/70 px-3 text-[11px] font-bold uppercase tracking-[0.06em] text-amber-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800 active:translate-y-0 sm:h-12 sm:gap-2 sm:px-5 sm:text-xs sm:tracking-[0.14em]"
                >
                  <Zap size={16} />
                  Buy Now
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-white/10" />

              {/* Mini Attar Selection Section */}
              <div className="mt-8 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                    Complete your wardrobe
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Selected: {selectedCount}/2
                  </p>
                </div>

                {/* Cards List */}
                <div className="max-w-full overflow-hidden">
                  <div className="flex max-w-full gap-2 overflow-x-auto px-0.5 pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent sm:gap-3">
                  {salimComboConfig.addOns.map((addOn) => {
                    const isSelected = !!selectedAddOns[addOn.id];
                    const isDisabled = !isSelected && selectedCount >= 2;

                    return (
                      <button
                        key={addOn.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleAddOn(addOn.id)}
                        className={`relative flex w-[112px] shrink-0 flex-col rounded-lg border-2 p-2.5 text-left transition-all duration-300 sm:w-[130px] sm:p-3 ${
                          isSelected
                            ? "border-sky-500 bg-sky-500/5 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                            : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                        } ${isDisabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#120b08] mb-2">
                          <Image
                            src={addOn.image}
                            alt={addOn.name}
                            fill
                            decoding="async"
                            sizes="120px"
                            className="object-cover"
                          />
                        </div>
                        
                        <h4 className="text-[11px] font-semibold text-zinc-100 line-clamp-2 leading-tight h-[2rem] overflow-hidden">
                          {addOn.name}
                        </h4>

                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-white">₹150</span>
                          <span className="text-[9px] text-zinc-400 line-through">₹250</span>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between w-full">
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] rounded bg-zinc-800/80 px-1 py-0.5 font-medium text-zinc-400">5ML</span>
                            <span className="text-[9px] font-bold text-emerald-400">In stock</span>
                          </div>
                          
                          {/* Selector indicator button */}
                          <div className={`flex h-4.5 w-4.5 items-center justify-center rounded-full transition-all duration-300 ${
                            isSelected
                              ? "bg-sky-500 text-white"
                              : "border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                          }`}>
                            {isSelected ? <Check size={10} strokeWidth={3} /> : <Plus size={10} />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  </div>
                </div>

                {/* Final Price Block */}
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Total Price</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Includes base attar + selected minis</p>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-2xl font-bold text-amber-200">
                      {formatPrice(comboState.finalTotal)}
                    </span>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </section>



      {/* Product Benefits Section */}
      <section className="border-t border-white/10 bg-[#070605] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="text-left">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
                Premium Standards
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl text-white">
                Engineered for Performance
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Salim Luxury Attar has been carefully blended to ensure a strong, premium presence that conforms to international skin-safety norms while lasting through humid Indian climates.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">0% Alcohol Formula</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Concentrated oil blend, zero irritation on skin, safe for daily application.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <RotateCcw size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">12+ Hour Sillage</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Rich, heavy projection designed to sustain high performance in Indian weather.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <Award size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Artisanal Packaging</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Bottled in custom-crafted glassware, perfect for high-end gifting.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Compliment Trigger</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Uniquely composed projection layers that command notice and appreciation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                  <Zap size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Why heat makes it better, not weaker</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Alcohol-based perfumes evaporate as your skin warms up — that&apos;s why they fade by afternoon. Salim is a concentrated oil blend. Body heat helps release its fragrance gradually, so a hot commute, a workout, or a long day at work brings the scent out rather than burning it away.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <ProductReviews product={salimProduct} />
    </main>
  );
}
