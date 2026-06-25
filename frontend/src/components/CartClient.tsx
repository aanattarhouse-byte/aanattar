"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/products";
import { getSalimComboState } from "@/lib/salimCombo";
import { getMinimumOrderStatus, MIN_AMOUNT } from "@/lib/minimumOrder";
import CheckoutAddressModal from "@/components/CheckoutAddressModal";

export default function CartClient() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const salimComboState = getSalimComboState(items);
  const minimumOrderStatus = getMinimumOrderStatus(items, subtotal);
  const canCheckout = minimumOrderStatus.canCheckout;
  const visibleItems = items;

  const startCheckout = async () => {
    setLoginMessage("");

    if (!canCheckout) {
      setLoginMessage("Minimum 2 products and ₹797 subtotal required to place an order.");
      return;
    }

    if (!user) {
      setLoginMessage("Please login to place your order.");
      try {
        await loginWithGoogle();
        setCheckoutOpen(true);
      } catch {
        setLoginMessage("Login is required before placing an order.");
      }
      return;
    }

    setCheckoutOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-[8px] border border-white/10 bg-white/[0.04] p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-200">
          <ShoppingBag size={26} />
        </div>
        <h1 className="mt-5 text-2xl">Your Cart Is Empty</h1>
        <p className="mt-3 text-sm text-zinc-300">
          Explore the collection and choose a signature attar to begin.
        </p>
        <Link
          href="/build-your-signature"
          className="mt-7 inline-flex h-11 items-center rounded-[8px] bg-[#D4A24C] px-5 text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#E0B35A]"
        >
          Shop Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {visibleItems.map((item) => (
          <article
            key={`${item.id}-${item.variant || "default"}-${item.volume || "volume"}`}
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
              <h2 className="text-xl font-semibold">{item.name}</h2>
              {item.variant && (
                <p className="mt-1 text-xs text-zinc-400">
                  {item.variant}
                </p>
              )}
              {item.volume && (
                <p className="mt-1 font-sans text-sm font-semibold text-zinc-400">
                  Volume: {item.volume.replace("ml", " ml")}
                </p>
              )}
              <p className="mt-2 font-sans text-sm font-bold text-amber-200">
                {formatPrice(item.price)}
              </p>
              <div className="mt-4 inline-flex h-10 items-center overflow-hidden rounded-[8px] border border-white/15 bg-white/5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1, item.variant, item.volume)
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
                    updateQuantity(item.id, item.quantity + 1, item.variant, item.volume)
                  }
                  className="grid h-10 w-10 place-items-center transition hover:bg-white/10"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <p className="text-base font-bold text-white">
                {formatPrice(item.price * item.quantity)}
              </p>
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() => removeItem(item.id, item.variant, item.volume)}
                className="grid h-10 w-10 place-items-center rounded-full text-amber-100 transition hover:bg-white/10"
              >
                <Trash2 size={17} />
              </button>
            </div>

          </article>
        ))}
      </div>

      <aside className="h-fit rounded-[8px] border border-amber-300/20 bg-[#1a120d] p-6">
        <h2 className="text-xl">Order Summary</h2>
        <div className="mt-6 space-y-3 border-y border-white/10 py-5">
          <div className="flex justify-between text-sm text-zinc-300">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {salimComboState.active && (
            <>
              <div className="rounded-[8px] border border-emerald-400/20 bg-emerald-400/10 p-3">
                <p className="text-xs font-bold text-emerald-200">
                  Salim Combo Offer Applied
                </p>
                <p className="mt-1 text-xs font-semibold text-emerald-100">
                  You saved {formatPrice(salimComboState.savedAmount)}
                </p>
              </div>
              <div className="flex justify-between text-sm font-semibold text-emerald-200">
                <span>Combo Discount</span>
                <span>-{formatPrice(salimComboState.discount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm text-zinc-300">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>
        <div className="mt-5 flex justify-between text-base font-bold">
          <span>{salimComboState.active ? "Final Total" : "Total"}</span>
          <span>{formatPrice(salimComboState.finalTotal)}</span>
        </div>
        <div
          className={`mt-4 rounded-[8px] border p-3 text-xs font-semibold ${
            canCheckout
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-amber-300/20 bg-amber-300/10 text-amber-100"
          }`}
        >
          {canCheckout ? (
            <p>✓ Eligible for Checkout</p>
          ) : (
            <>
              <p>Need:</p>
              <ul className="mt-2 space-y-1">
                {minimumOrderStatus.needsProducts && (
                  <li>• Minimum 2 products</li>
                )}
                {minimumOrderStatus.needsAmount && (
                  <li>• Minimum ₹{MIN_AMOUNT} subtotal</li>
                )}
              </ul>
            </>
          )}
        </div>
        {!canCheckout && (
          <div className="mt-3 space-y-2 text-xs font-semibold text-amber-100">
            {minimumOrderStatus.needsProducts && (
              <p className="rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-3">
                ⚠ Please add at least 2 attars to build your wardrobe.
              </p>
            )}
            {minimumOrderStatus.needsAmount && (
              <p className="rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-3">
                ⚠ Minimum order amount is ₹{MIN_AMOUNT}. Add ₹
                {minimumOrderStatus.missingAmount} more to continue.
              </p>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={startCheckout}
          disabled={!canCheckout || authLoading}
          className={`mt-6 h-12 w-full rounded-[8px] text-xs font-bold uppercase tracking-[0.12em] text-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
            canCheckout
              ? "bg-[#D4A24C] hover:bg-[#E0B35A]"
              : "bg-gray-300 cursor-not-allowed opacity-50"
          }`}
        >
          {authLoading ? "Logging In..." : user ? "Order Now" : "Login To Order"}
        </button>
        {loginMessage && (
          <p className="mt-3 rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-3 text-xs font-semibold text-amber-100">
            {loginMessage}
          </p>
        )}
      </aside>
      {checkoutOpen && (
        <CheckoutAddressModal
          items={items}
          subtotal={subtotal}
          discount={salimComboState.discount}
          finalAmount={salimComboState.finalTotal}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
