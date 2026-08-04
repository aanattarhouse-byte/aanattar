"use client";

import ProductFilter from "@/components/ProductFilter";
import type { Product } from "@/lib/products";

export default function SignatureProductExplorer({
  products,
}: {
  products: Product[];
}) {
  return <ProductFilter products={products} />;
}
