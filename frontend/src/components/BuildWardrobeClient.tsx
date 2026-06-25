"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { requestCartOpen } from "@/lib/cart";
import { MINIMUM_ORDER_TOAST } from "@/lib/minimumOrder";
import { getProductBySlug, formatPrice, getCompareAtPrice, type Product } from "@/lib/products";
import GalaxyParticleField from "@/components/particles/GalaxyParticleField";

type WardrobeRecommendation = {
  slug: string;
  name: string;
  occasion: string;
  line: string;
};

const recommendations: WardrobeRecommendation[] = [
  {
    slug: "armani-prestige",
    name: "Armani Prestige",
    occasion: "For the Interview",
    line: "You've rehearsed everything. Don't forget this.",
  },
  {
    slug: "one-man-show-signature",
    name: "One Man Show Signature",
    occasion: "For the Boardroom",
    line: "Because showing up prepared means showing up completely.",
  },
  {
    slug: "white-musk-pure",
    name: "White Musk Pure",
    occasion: "For Every Day",
    line: "Wear it and people just... like being around you more. Coincidence? No.",
  },
  {
    slug: "dior-sauvage-intense",
    name: "Dior Sauvage Intense",
    occasion: "For the First Date",
    line: "We're not saying it's magic. We're just saying it works.",
  },
  {
    slug: "giorgio-armani-luxe",
    name: "Giorgio Armani Luxe",
    occasion: "For the Wedding",
    line: "Be the guest they talk about at brunch the next morning.",
  },
  {
    slug: "gucci-guilty-cologne-supreme",
    name: "Gucci Guilty Cologne Supreme",
    occasion: "For the Party",
    line: "The playlist is good. The drinks are good. You smell incredible. Perfect night.",
  },
  {
    slug: "signature-noir",
    name: "Signature Noir",
    occasion: "For the Dinner",
    line: "Order whatever you want — you've already impressed them.",
  },
  {
    slug: "intemate-velvet",
    name: "Intimate Velvet",
    occasion: "For the Second Date",
    line: "Put in the effort. It'll show. It always shows.",
  },
  {
    slug: "chanel-bleu-de-chanel-reserve",
    name: "Chanel Bleu de Chanel Réserve",
    occasion: "For the Big Moments",
    line: "Life's too short to skip the Chanel.",
  },
  {
    slug: "gucci-flora-bloom",
    name: "Gucci Flora Bloom",
    occasion: 'For "Her"',
    line: "A fragrance that turns ordinary moments into memorable ones.",
  },
];

function getRecommendationProduct(recommendation: WardrobeRecommendation) {
  const product = getProductBySlug(recommendation.slug);

  if (!product) {
    throw new Error(`Missing wardrobe product: ${recommendation.slug}`);
  }

  return product;
}

function buildCartItem(
  product: Product,
  recommendation: WardrobeRecommendation,
  isPremiumCollection?: boolean
) {
  return {
    id: product.id,
    slug: product.slug,
    name: recommendation.name,
    image: product.image,
    price: isPremiumCollection ? 149 : product.price,
    quantity: 1,
    variant: isPremiumCollection ? "Premium Collection" : undefined,
    volume: isPremiumCollection ? "5ml" : undefined,
  };
}

export default function BuildWardrobeClient({
  isPremiumCollection = true,
}: {
  isPremiumCollection?: boolean;
}) {
  const [touchedSlug, setTouchedSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const { addItem } = useCart();
  const wardrobe = recommendations.map((recommendation) => ({
    ...recommendation,
    product: getRecommendationProduct(recommendation),
  }));

  const addRecommendation = (
    product: Product,
    recommendation: WardrobeRecommendation
  ) => {
    addItem(buildCartItem(product, recommendation, isPremiumCollection));
    requestCartOpen();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("minimumOrder") !== "1") {
      return;
    }

    const showToastId = window.setTimeout(
      () => setToastMessage(MINIMUM_ORDER_TOAST),
      0
    );
    params.delete("minimumOrder");
    const nextSearch = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`
    );

    const timeoutId = window.setTimeout(() => setToastMessage(""), 5200);

    return () => {
      window.clearTimeout(showToastId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {toastMessage && (
        <div className="fixed left-1/2 top-4 z-[130] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 rounded-[8px] border border-amber-300/30 bg-[#1a120d] px-4 py-3 text-sm font-semibold text-amber-100 shadow-[0_18px_50px_rgba(0,0,0,0.35)] sm:top-6">
          {toastMessage}
        </div>
      )}
      {/* Top Hero Section with swirling galaxy background */}
      <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 w-full border-b border-white/5">
        <GalaxyParticleField className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0b0b] to-transparent pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Curated Selection
            </p>
            <h1 className="mt-3 !text-3xl leading-none sm:!text-4xl lg:!text-5xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              Build Your Wardrobe
            </h1>
            <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Choose by occasion, mood, and the room you are walking into.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Content Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20 w-full">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {wardrobe.map(({ product, ...recommendation }) => {
            const cardPrice = isPremiumCollection ? 149 : product.price;
            const cardDiscountPercent = isPremiumCollection
              ? Math.round(((product.price - 149) / product.price) * 100)
              : product.discountPercent || 20;
            const cardCompareAtPrice = isPremiumCollection
              ? product.price
              : getCompareAtPrice(product.price, cardDiscountPercent);

            const isTouched = touchedSlug === recommendation.slug;

            return (
              <article
                key={recommendation.slug}
                className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-white/10 bg-[#15100d]/90 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-300/35 hover:shadow-[0_28px_80px_rgba(212,162,76,0.14)]"
              >
                <Link
                  href={`/product/${product.slug}${isPremiumCollection ? "?collection=premium" : ""}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-[#0f0907]"
                  aria-label={`View ${recommendation.name}`}
                  onTouchStart={() => setTouchedSlug(recommendation.slug)}
                  onTouchEnd={() => setTouchedSlug(null)}
                  onTouchCancel={() => setTouchedSlug(null)}
                >
                  <Image
                    src={product.image}
                    alt={recommendation.name}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className={`object-cover transition duration-700 ease-out md:group-hover:scale-105 ${
                      isTouched ? "scale-105 opacity-0" : ""
                    } ${product.hoverImage ? "md:group-hover:opacity-0" : ""}`}
                  />
                  {product.hoverImage ? (
                    <Image
                      src={product.hoverImage}
                      alt={`${recommendation.name} packaging`}
                      fill
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className={`object-cover transition duration-700 ease-out md:group-hover:scale-105 md:group-hover:opacity-100 ${
                        isTouched ? "scale-105 opacity-100" : "opacity-0"
                      }`}
                    />
                  ) : null}
                  <span className="absolute left-3 top-3 rounded-full border border-amber-300/30 bg-black/55 px-3 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em] text-amber-200">
                    {recommendation.occasion}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-display !text-lg sm:!text-xl font-semibold leading-tight text-white">
                    {recommendation.name}
                  </h3>

                  <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-zinc-300">
                    {recommendation.line}
                  </p>

                  {/* Price, Stock and Discount info */}
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="font-bold text-amber-200 text-xs">
                        {formatPrice(cardPrice)}
                      </span>
                      {cardCompareAtPrice > cardPrice && (
                        <>
                          <span className="line-through text-[10px] text-zinc-500">
                            {formatPrice(cardCompareAtPrice)}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            {cardDiscountPercent}% off
                          </span>
                        </>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium font-sans">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Stock
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-1 gap-2 pt-5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => addRecommendation(product, recommendation)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] px-3 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-black shadow-[0_10px_24px_rgba(212,162,76,0.22)] transition hover:brightness-105"
                    >
                      <ShoppingCart size={15} strokeWidth={2.4} />
                      Add to Cart
                    </button>
                    <Link
                      href={`/product/${product.slug}${isPremiumCollection ? "?collection=premium" : ""}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-amber-300/30 bg-white/5 px-3 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-amber-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-black"
                    >
                      <Eye size={15} />
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
