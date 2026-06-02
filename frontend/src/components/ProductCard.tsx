"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { requestCartOpen } from "@/lib/cart";
import {
  formatPrice,
  getCompareAtPrice,
  getProductDiscountPercent,
  type Product,
} from "@/lib/products";

export default function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const discountPercent = getProductDiscountPercent(product);
  const compareAtPrice = getCompareAtPrice(product.price, discountPercent);

  const addToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });
    requestCartOpen();
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-white/10 bg-[#15100d]/90 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#0f0907]"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition duration-700 ease-out group-hover:scale-105 ${
            product.hoverImage ? "group-hover:opacity-0" : ""
          }`}
        />
        {product.hoverImage ? (
          <Image
            src={product.hoverImage}
            alt={`${product.name} packaging`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          />
        ) : null}
        <span className={`absolute left-4 top-4 rounded-full border border-amber-300/30 bg-black/50 font-bold uppercase tracking-[0.16em] text-amber-200 ${
          compact ? "px-2.5 py-0.5 text-[0.56rem]" : "px-3 py-1 text-[0.65rem]"
        }`}>
          {product.category.split(" ")[0]}
        </span>
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex items-start justify-between gap-4">
          <h3 className={`font-display leading-tight text-white ${
            compact ? "!text-lg sm:!text-xl" : "text-2xl"
          }`}>
            {product.name}
          </h3>
        </div>

        <div className={`${compact ? "mt-2 gap-1.5" : "mt-3 gap-2"} flex flex-wrap items-center`}>
          <span className={`font-sans font-bold leading-none text-amber-100 ${
            compact ? "text-base" : "text-xl"
          }`}>
            {formatPrice(product.price)}
          </span>
          <span className={`font-sans font-semibold leading-none text-zinc-500 line-through ${
            compact ? "text-xs" : "text-sm"
          }`}>
            {formatPrice(compareAtPrice)}
          </span>
          <span className={`rounded-[3px] bg-emerald-600 px-2 py-1 font-sans font-bold leading-none text-white ${
            compact ? "text-[0.58rem]" : "text-[0.68rem]"
          }`}>
            {discountPercent}% off
          </span>
        </div>

        <p className={`mt-2 line-clamp-3 text-zinc-300 ${
          compact ? "text-xs" : "text-sm"
        }`}>
          {product.shortDescription}
        </p>

        <div className={`${compact ? "mt-4" : "mt-5"} grid grid-cols-[1fr_auto] gap-2`}>
          <Link
            href={`/product/${product.slug}`}
            className={`inline-flex items-center justify-center rounded-[8px] border border-amber-300/30 bg-white/5 font-bold text-amber-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-black ${
              compact ? "h-10 px-3 text-xs" : "h-11 px-4 text-sm"
            }`}
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={addToCart}
            aria-label={`Add ${product.name} to cart`}
            className={`grid place-items-center rounded-[8px] bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] text-black shadow-[0_10px_24px_rgba(212,162,76,0.24)] transition hover:brightness-105 ${
              compact ? "h-10 w-10" : "h-11 w-11"
            }`}
          >
            <ShoppingCart size={compact ? 16 : 18} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
