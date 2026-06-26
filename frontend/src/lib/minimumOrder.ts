import type { CartItem } from "@/lib/cart";

export const MIN_PRODUCTS = 2;
export const MIN_AMOUNT = 797;
const SALIM_PRODUCT_SLUG = "salim-luxury-attar";
export const MINIMUM_ORDER_TOAST =
  "Minimum 2 products and ₹797 subtotal required to place an order.";

export function getMinimumOrderStatus(items: CartItem[], subtotal: number) {
  const hasSalimProduct = items.some(
    (item) => item.slug === SALIM_PRODUCT_SLUG || item.id === SALIM_PRODUCT_SLUG
  );

  if (!hasSalimProduct) {
    return {
      canCheckout: true,
      missingProducts: 0,
      missingAmount: 0,
      needsProducts: false,
      needsAmount: false,
    };
  }

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
