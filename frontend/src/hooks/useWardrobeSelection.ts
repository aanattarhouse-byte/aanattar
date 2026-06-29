"use client";

import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/lib/cart";

export const WARDROBE_ITEM_SOURCE = "build-your-wardrobe";

export function useWardrobeSelection() {
  const { items, addItem } = useCart();
  const wardrobeItems = items.filter((item) => item.source === WARDROBE_ITEM_SOURCE);
  const selectedCount = wardrobeItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const addWardrobeItem = (item: CartItem) => {
    addItem({
      ...item,
      source: WARDROBE_ITEM_SOURCE,
    });
  };

  return {
    selectedCount,
    wardrobeItems,
    addWardrobeItem,
  };
}
