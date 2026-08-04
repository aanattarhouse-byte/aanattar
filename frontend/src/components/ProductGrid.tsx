"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import type { ProductCardDetailMode } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductGrid({
  products,
  compact = false,
  priceOverride,
  hideAddToCart = false,
  detailMode = "notes",
  animated = false,
}: {
  products: Product[];
  compact?: boolean;
  priceOverride?: number;
  hideAddToCart?: boolean;
  detailMode?: ProductCardDetailMode;
  animated?: boolean;
}) {
  const Component = animated ? motion.div : "div";

  return (
    <Component
      className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
        compact ? "gap-4" : "gap-5"
      }`}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      variants={
        animated
          ? {
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.07 },
              },
            }
          : undefined
      }
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="h-full"
          variants={
            animated
              ? {
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }
              : undefined
          }
          transition={animated ? { duration: 0.28 } : undefined}
        >
          <ProductCard
            product={product}
            compact={compact}
            priceOverride={priceOverride}
            hideAddToCart={hideAddToCart}
            detailMode={detailMode}
          />
        </motion.div>
      ))}
    </Component>
  );
}
