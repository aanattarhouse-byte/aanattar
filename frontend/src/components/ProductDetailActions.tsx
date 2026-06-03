"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
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

export default function ProductDetailActions({
  product,
}: {
  product: Product;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVolume, setSelectedVolume] = useState<ProductVolumeMl>(
    DEFAULT_PRODUCT_VOLUME_ML
  );
  const router = useRouter();
  const { addItem } = useCart();
  const price = getVolumePrice(selectedVolume);
  const discountPercent = getProductDiscountPercent(product);
  const compareAtPrice = getCompareAtPrice(price, discountPercent);
  const selectedVolumeValue = getVolumeCartValue(selectedVolume);

  const addProduct = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price,
      quantity,
      volume: selectedVolumeValue,
    });
  };

  const addProductAndShowCart = () => {
    addProduct();
    requestCartOpen();
  };

  const buyNow = () => {
    addProduct();
    router.push("/cart");
  };

  return (
    <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:text-xs sm:tracking-[0.2em]">
          Volume
        </span>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {PRODUCT_VOLUME_OPTIONS.map((volume) => {
            const selected = selectedVolume === volume;

            return (
              <button
                key={volume}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedVolume(volume)}
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
                  {formatPrice(getVolumePrice(volume))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-2xl font-bold leading-none text-amber-200">
          {formatPrice(price)}
        </span>
        <span className="font-sans text-base font-semibold leading-none text-zinc-500 line-through">
          {formatPrice(compareAtPrice)}
        </span>
        <span className="rounded-[3px] bg-emerald-600 px-2 py-1 font-sans text-xs font-bold leading-none text-white">
          {discountPercent}% off
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center justify-between gap-3 sm:justify-start">
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
      <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
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
    </div>
  );
}
