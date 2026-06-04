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
  Heart,
  RotateCcw,
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
import ScrollReveal from "@/components/ScrollReveal";

const galleryImages = ["/salim1.jpg", "/salim2.jpg"];

export default function SalimDetailsClient() {
  const router = useRouter();
  const { addItem } = useCart();
  const salimProduct = getProductBySlug("salim-luxury-attar");

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
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

  const totalComparePrice = (compareAtPrice + (selectedCount * 150)) * quantity;
  const currentTotal = comboState.finalTotal;
  const currentDiscountPercent = totalComparePrice > 0 ? Math.round(((totalComparePrice - currentTotal) / totalComparePrice) * 100) : 0;

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

  // Compute normal item cost without combo discount (if discount not active)
  const normalTotal = mockItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#0b0b0b] font-sans text-white">
      {/* Hero section */}
      <section className="px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          
          {/* Gallery component */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-[8px] border border-white/10 bg-[#120b08] shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
              <Image
                src={activeImage}
                alt="Salim Luxury Attar main view"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-all duration-700 hover:scale-105"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-4">
              {galleryImages.map((img, i) => {
                const isActive = activeImage === img;
                return (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square w-24 overflow-hidden rounded-[6px] border bg-[#120b08] transition-all duration-300 ${
                      isActive ? "border-amber-300 ring-1 ring-amber-300/30" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Salim Luxury Attar view ${i + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details & Actions */}
          <ScrollReveal>
            <div>
              {/* Premium Tag */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                <Sparkles size={12} className="text-amber-300" />
                Signature Classics
              </span>

              {/* Title & Ratings */}
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                {salimProduct.name}
              </h1>

              {/* Quick Stars */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-zinc-400">
                  4.8 / 5.0 (3 verified reviews)
                </span>
              </div>

              {/* Short Description */}
              <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
                {salimProduct.description}
              </p>

              {/* Size Selector */}
              <div className="mt-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Volume / Size
                </span>
                <div className="flex">
                  <div className="rounded-[8px] border border-amber-300/70 bg-amber-300/15 px-5 py-3 text-left shadow-[0_0_0_1px_rgba(248,220,123,0.18)]">
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
              <div className="mt-6 flex items-center gap-3">
                <span className="font-sans text-3xl font-bold text-amber-200">
                  {formatPrice(basePrice)}
                </span>
                <span className="font-sans text-lg font-semibold text-zinc-500 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
                <span className="rounded-[3px] bg-emerald-600 px-2 py-1 font-sans text-xs font-bold text-white">
                  {discountPercent}% OFF
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
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
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {salimComboConfig.addOns.map((addOn) => {
                    const isSelected = !!selectedAddOns[addOn.id];
                    const isDisabled = !isSelected && selectedCount >= 2;

                    return (
                      <button
                        key={addOn.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => toggleAddOn(addOn.id)}
                        className={`relative flex flex-col p-3 rounded-lg border-2 w-[125px] shrink-0 text-left transition-all duration-300 ${
                          isSelected
                            ? "border-sky-500 bg-sky-500/5 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
                            : "border-white/10 bg-zinc-900/40 hover:border-white/20"
                        } ${isDisabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#120b08] mb-3">
                          <Image
                            src={addOn.image}
                            alt={addOn.name}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-1 text-xs font-bold text-white">₹150</p>
                        <p className="mt-0.5 text-[10px] text-zinc-400 line-through font-sans">₹250</p>
                        
                        <div className="mt-1.5 flex items-center justify-between w-full">
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

                {/* Final Price Block */}
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
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

              {/* Action Buttons */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] px-5 text-xs font-bold uppercase tracking-[0.14em] text-black shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
                >
                  <ShoppingCart size={16} strokeWidth={2.4} />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="group flex h-12 items-center justify-center gap-2 rounded-lg border border-amber-400/20 bg-zinc-900/70 px-5 text-xs font-bold uppercase tracking-[0.14em] text-amber-100 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-800 active:translate-y-0"
                >
                  <Zap size={16} />
                  Buy Now
                </button>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>



      {/* Product Benefits Section */}
      <section className="border-t border-white/10 bg-[#070605] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Reviews section */}
      <ProductReviews product={salimProduct} />
    </main>
  );
}
