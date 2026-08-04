import ProductCard from "@/components/ProductCard";
import type { ProductCardDetailMode } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductGrid({
  products,
  compact = false,
  priceOverride,
  hideAddToCart = false,
  detailMode = "notes",
}: {
  products: Product[];
  compact?: boolean;
  priceOverride?: number;
  hideAddToCart?: boolean;
  detailMode?: ProductCardDetailMode;
}) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
      compact ? "gap-4" : "gap-5"
    }`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          compact={compact}
          priceOverride={priceOverride}
          hideAddToCart={hideAddToCart}
          detailMode={detailMode}
        />
      ))}
    </div>
  );
}
