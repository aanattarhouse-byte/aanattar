"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SALIM_WARDROBE_BUNDLE_SLUG, formatPrice } from "@/lib/products";

export default function CartClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const hasSalimProductInCart = items.some(
    (item) => item.slug === "salim-luxury-attar"
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-[8px] border border-white/10 bg-white/[0.04] p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-200">
          <ShoppingBag size={26} />
        </div>
        <h1 className="mt-5 text-4xl">Your Cart Is Empty</h1>
        <p className="mt-3 text-zinc-300">
          Explore the collection and choose a signature attar to begin.
        </p>
        <Link
          href="/build-your-signature"
          className="mt-7 inline-flex h-12 items-center rounded-[8px] bg-[#D4A24C] px-6 text-sm font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#E0B35A]"
        >
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={`${item.id}-${item.variant || "default"}`}
            className="grid gap-4 rounded-[8px] border border-white/10 bg-[#15100d]/90 p-4 sm:grid-cols-[120px_1fr_auto]"
          >
            <Link
              href={item.slug ? `/product/${item.slug}` : "/build-your-signature"}
              className="relative aspect-square overflow-hidden rounded-[8px] bg-black/20"
            >
              <Image
                src={item.image || "/attar-bottle.svg"}
                alt={item.name}
                fill
                sizes="120px"
                className="object-cover"
              />
            </Link>

            <div>
              <h2 className="text-2xl">{item.name}</h2>
              <p className="mt-2 font-sans text-sm font-bold text-amber-200">
                {formatPrice(item.price)}
              </p>
              <div className="mt-4 inline-flex h-10 items-center overflow-hidden rounded-[8px] border border-white/15 bg-white/5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1, item.variant)
                  }
                  className="grid h-10 w-10 place-items-center transition hover:bg-white/10"
                >
                  <Minus size={15} />
                </button>
                <span className="grid h-10 min-w-10 place-items-center border-x border-white/15 text-sm font-bold">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1, item.variant)
                  }
                  className="grid h-10 w-10 place-items-center transition hover:bg-white/10"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <p className="font-bold text-white">
                {formatPrice(item.price * item.quantity)}
              </p>
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() => removeItem(item.id, item.variant)}
                className="grid h-10 w-10 place-items-center rounded-full text-amber-100 transition hover:bg-white/10"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
        {hasSalimProductInCart && (
          <div className="rounded-[8px] border border-amber-300/25 bg-amber-300/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-3xl text-white">
                  Build your wardrobe
                </p>
                <p className="mt-2 text-sm font-semibold text-amber-100">
                  Buy 3 products at {formatPrice(799)}
                </p>
                <p className="mt-1 font-sans text-xs font-bold uppercase tracking-[0.16em] text-amber-200">
                  12 ML + 5 ML + 5 ML
                </p>
              </div>
              <Link
                href={`/product/${SALIM_WARDROBE_BUNDLE_SLUG}`}
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#D4A24C] px-5 text-sm font-bold uppercase tracking-[0.1em] text-black transition hover:bg-[#E0B35A]"
              >
                Choose more
              </Link>
            </div>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-[8px] border border-amber-300/20 bg-[#1a120d] p-6">
        <h2 className="text-3xl">Order Summary</h2>
        <div className="mt-6 space-y-3 border-y border-white/10 py-5">
          <div className="flex justify-between text-sm text-zinc-300">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-300">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>
        <div className="mt-5 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <button
          type="button"
          className="mt-6 h-13 w-full rounded-[8px] bg-[#D4A24C] text-sm font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#E0B35A]"
        >
          Order Now
        </button>
      </aside>
    </div>
  );
}
