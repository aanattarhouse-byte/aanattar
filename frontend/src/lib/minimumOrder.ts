import type { CartItem } from "@/lib/cart";

export const MIN_PRODUCTS = 2;
export const MIN_AMOUNT = 797;
export const MINIMUM_ORDER_TOAST =
  "Minimum 2 products and ₹797 subtotal required to place an order.";

export function getMinimumOrderStatus(items: CartItem[], subtotal: number) {
  const missingProducts = Math.max(MIN_PRODUCTS - items.length, 0);
  const missingAmount = Math.max(MIN_AMOUNT - subtotal, 0);
  const canCheckout = missingProducts === 0 && missingAmount === 0;

  return {
    canCheckout,
    missingProducts,
    missingAmount,
    needsProducts: missingProducts > 0,
    needsAmount: missingAmount > 0,
  };
}
