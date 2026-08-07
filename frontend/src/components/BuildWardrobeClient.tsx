"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, ShoppingCart, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { requestCartOpen } from "@/lib/cart";
import {
  getCompareAtPrice,
  getProductBySlug,
  getProductDiscountPercent,
  formatPrice,
  type Product,
} from "@/lib/products";
import GalaxyParticleField from "@/components/particles/GalaxyParticleField";
import { useMinimumSelection } from "@/hooks/useMinimumSelection";
import {
  type GuardReason,
  type PendingNavigation,
  useNavigationGuard,
} from "@/hooks/useNavigationGuard";
import { useWardrobeSelection } from "@/hooks/useWardrobeSelection";

type LenisController = {
  start: () => void;
  stop: () => void;
};

function getLenis() {
  const lenis = (window as unknown as { lenis?: Partial<LenisController> }).lenis;

  if (
    lenis &&
    typeof lenis.start === "function" &&
    typeof lenis.stop === "function"
  ) {
    return lenis as LenisController;
  }

  return undefined;
}

type WardrobeRecommendation = {
  slug: string;
  name: string;
  occasion: string;
  line: string;
};

const PREMIUM_COLLECTION_PRICE = 150;

const recommendations: WardrobeRecommendation[] = [
  {
    slug: "aqua-prestige",
    name: "Aqua Prestige",
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
    slug: "raw-woods-intense",
    name: "Raw Woods Intense",
    occasion: "For the First Date",
    line: "We're not saying it's magic. We're just saying it works.",
  },
  {
    slug: "mediterranean-luxe",
    name: "Mediterranean Luxe",
    occasion: "For the Wedding",
    line: "Be the guest they talk about at brunch the next morning.",
  },
  {
    slug: "cypress-supreme",
    name: "Cypress Supreme",
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
    slug: "azure-cedar-reserve",
    name: "Azure Cedar Reserve",
    occasion: "For the Big Moments",
    line: "Life's too short to skip the signature.",
  },
  {
    slug: "garden-bloom",
    name: "Garden Bloom",
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
    price: isPremiumCollection ? PREMIUM_COLLECTION_PRICE : product.price,
    quantity: 1,
    variant: isPremiumCollection ? "Premium Collection" : undefined,
    volume: isPremiumCollection ? "10ml" : undefined,
  };
}

function WardrobeGuardModal({
  mode,
  onClose,
  onReturnAnyway,
  onContinueAnyway,
}: {
  mode: GuardReason | "confirm" | null;
  onClose: () => void;
  onReturnAnyway: () => void;
  onContinueAnyway: () => void;
}) {
  const content = {
    empty: {
      title: "Complete Your Wardrobe",
      message: "Please add at least 2 products before returning to your cart.",
      primary: "Continue Shopping",
      secondary: "Cancel",
    },
    "one-more": {
      title: "Just One More",
      message:
        "You've selected only 1 product. Add one more to complete your wardrobe and unlock the recommended fragrance pairing.",
      primary: "Add One More",
      secondary: "Return Anyway",
    },
    confirm: {
      title: "Are you sure?",
      message:
        "Your wardrobe works best with at least 2 fragrances. Continue with only one?",
      primary: "Stay Here",
      secondary: "Continue Anyway",
    },
  } as const;

  useEffect(() => {
    if (!mode) return;

    // Disable background scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Stop Lenis smooth scroll if active
    getLenis()?.stop();

    return () => {
      document.body.style.overflow = originalStyle;

      // Re-enable Lenis smooth scroll
      getLenis()?.start();
    };
  }, [mode]);

  if (!mode) {
    return null;
  }

  const modal = content[mode];
  const titleId = `wardrobe-${mode}-title`;
  const messageId = `wardrobe-${mode}-message`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ type: "spring", duration: 0.45 }}
          className="relative w-full max-w-md overflow-hidden rounded-[14px] border border-amber-300/20 bg-[#0d0a08] p-6 text-center shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={messageId}
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-200">
            <Sparkles size={20} />
          </div>
          <h2 id={titleId} className="mt-5 font-display text-2xl font-semibold text-white">
            {modal.title}
          </h2>
          <p id={messageId} className="mt-3 text-sm leading-6 text-zinc-300">{modal.message}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-[8px] bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] px-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition hover:brightness-105"
            >
              {modal.primary}
            </button>
            <button
              type="button"
              onClick={mode === "one-more" ? onReturnAnyway : mode === "confirm" ? onContinueAnyway : onClose}
              className="inline-flex h-11 items-center justify-center rounded-[8px] border border-amber-300/25 bg-white/5 px-4 text-xs font-bold uppercase tracking-[0.08em] text-amber-100 transition hover:border-amber-300/50 hover:bg-white/10"
            >
              {modal.secondary}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function BuildWardrobeClient({
  isPremiumCollection = true,
}: {
  isPremiumCollection?: boolean;
}) {
  const router = useRouter();
  const [touchedSlug, setTouchedSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [modalMode, setModalMode] = useState<GuardReason | "confirm" | null>(null);
  const [showCompleteReminder, setShowCompleteReminder] = useState(false);
  const pendingNavigationRef = useRef<PendingNavigation | undefined>(undefined);
  const completeReminderTimerRef = useRef<number | null>(null);
  const { wardrobeFlow } = useCart();
  const { selectedCount, addWardrobeItem } = useWardrobeSelection();
  const minimumRequired = wardrobeFlow?.minimumRequired ?? 2;
  const minimumSelection = useMinimumSelection(selectedCount, minimumRequired);
  const guardEnabled = wardrobeFlow?.source === "cart";
  const wardrobe = recommendations.map((recommendation) => ({
    ...recommendation,
    product: getRecommendationProduct(recommendation),
  }));

  const handleBlockedNavigation = useCallback(
    (reason: GuardReason, pendingNavigation?: PendingNavigation) => {
      pendingNavigationRef.current = pendingNavigation;
      setModalMode(reason);
    },
    []
  );

  const { continueNavigation } = useNavigationGuard({
    enabled: guardEnabled,
    selectedCount,
    minimumRequired,
    onBlocked: handleBlockedNavigation,
  });

  const addRecommendation = (
    product: Product,
    recommendation: WardrobeRecommendation
  ) => {
    addWardrobeItem(buildCartItem(product, recommendation, isPremiumCollection));
    setToastMessage(`${recommendation.name} added to your wardrobe.`);

    if (selectedCount + 1 >= minimumRequired) {
      if (guardEnabled) {
        setShowCompleteReminder(true);

        if (completeReminderTimerRef.current) {
          window.clearTimeout(completeReminderTimerRef.current);
        }

        completeReminderTimerRef.current = window.setTimeout(() => {
          setShowCompleteReminder(false);
          completeReminderTimerRef.current = null;
        }, 2000);
      }

      // Automatically redirect to /cart page after a brief delay
      window.setTimeout(() => {
        router.push("/cart");
      }, 1200);
    }
  };

  const closeModal = () => setModalMode(null);

  const returnAnyway = () => setModalMode("confirm");

  const continueAnyway = () => {
    const pendingNavigation = pendingNavigationRef.current;

    setModalMode(null);
    pendingNavigationRef.current = undefined;

    if (pendingNavigation?.type === "done") {
      requestCartOpen();
      return;
    }

    continueNavigation(pendingNavigation);
  };

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => setToastMessage(""), 1800);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    return () => {
      if (completeReminderTimerRef.current) {
        window.clearTimeout(completeReminderTimerRef.current);
      }
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

        <div className="mx-auto flex max-w-7xl flex-col gap-6 relative z-10 sm:flex-row sm:items-start sm:justify-between">
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
            const regularPrice = product.price * 10;
            const cardPrice = isPremiumCollection ? PREMIUM_COLLECTION_PRICE : product.price;
            const cardDiscountPercent = isPremiumCollection
              ? Math.round(((regularPrice - PREMIUM_COLLECTION_PRICE) / regularPrice) * 100)
              : getProductDiscountPercent(product);
            const cardCompareAtPrice = isPremiumCollection
              ? regularPrice
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
                    decoding="async"
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
                      decoding="async"
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
      <AnimatePresence>
        {guardEnabled && (!minimumSelection.isComplete || showCompleteReminder) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-x-0 bottom-0 z-[140] border-t border-amber-300/20 bg-[#070605]/95 px-4 py-4 text-white shadow-[0_-20px_70px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-6"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-display text-base font-semibold text-white">
                  {minimumSelection.isComplete ? "Wardrobe Complete" : "Build Your Wardrobe"}
                </p>
                <div className="mt-2 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642]"
                    animate={{
                      width: `${(minimumSelection.progressValue / minimumRequired) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-300">
                  <span className="font-bold text-amber-100">
                    {minimumSelection.isComplete && <Check size={14} className="mr-1 inline" />}
                    {minimumSelection.progressValue} / {minimumRequired} Products Selected
                  </span>
                  {!minimumSelection.isComplete && (
                    <span>
                      Add {minimumSelection.remainingCount} more fragrance
                      {minimumSelection.remainingCount === 1 ? "" : "s"} to continue.
                    </span>
                  )}
                </div>
              </div>
              {!minimumSelection.isComplete && (
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] px-5 text-xs font-bold uppercase tracking-[0.08em] text-black transition hover:brightness-105"
                >
                  Continue Shopping
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <WardrobeGuardModal
        mode={modalMode}
        onClose={closeModal}
        onReturnAnyway={returnAnyway}
        onContinueAnyway={continueAnyway}
      />
    </main>
  );
}
