"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { requestCartOpen } from "@/lib/cart";
import type { Product } from "@/lib/products";

export default function ProductDetailActions({
  product,
}: {
  product: Product;
}) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem } = useCart();

  const addProduct = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
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
