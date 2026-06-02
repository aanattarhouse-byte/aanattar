"use client";

import { useCart } from "@/context/CartContext";
import { requestCartOpen } from "@/lib/cart";
import { products } from "@/lib/products";
import type { ReactNode } from "react";

const salimProduct = products.find((product) => product.slug === "salim-luxury-attar");

export default function ShopSalimButton({
  children = "Shop Salim",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { addItem } = useCart();

  const addSalimToCart = () => {
    if (!salimProduct) {
      return;
    }

    addItem({
      id: salimProduct.id,
      slug: salimProduct.slug,
      name: salimProduct.name,
      image: salimProduct.image,
      price: salimProduct.price,
      quantity: 1,
    });
    requestCartOpen();
  };

  return (
    <button type="button" onClick={addSalimToCart} className={className}>
      {children}
    </button>
  );
}
