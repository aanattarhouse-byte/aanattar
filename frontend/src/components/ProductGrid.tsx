import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductGrid({
  products,
  compact = false,
}: {
  products: Product[];
  compact?: boolean;
}) {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
      compact ? "gap-4" : "gap-5"
    }`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact={compact} />
      ))}
    </div>
  );
}
