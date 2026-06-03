"use client";

export type CartItem = {
  id: string;
  slug?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: string;
  volume?: string;
};

export const CART_STORAGE_KEY = "aanstory_cart";
export const CART_UPDATED_EVENT = "aanstory-cart-updated";
export const CART_OPEN_EVENT = "aanstory-cart-open";

export function getCartItems() {
  if (typeof window === "undefined") {
    return [] as CartItem[];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [] as CartItem[];
    }

    return JSON.parse(stored) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
}

export function getCartCount() {
  return getCartItems().reduce((total, item) => total + item.quantity, 0);
}

export function addCartItem(item: CartItem) {
  if (typeof window === "undefined") {
    return [] as CartItem[];
  }

  const items = getCartItems();
  const existing = items.find(
    (cartItem) =>
      cartItem.id === item.id &&
      cartItem.variant === item.variant &&
      cartItem.volume === item.volume
  );

  const nextItems = existing
    ? items.map((cartItem) =>
        cartItem.id === item.id &&
        cartItem.variant === item.variant &&
        cartItem.volume === item.volume
          ? {
              ...cartItem,
              quantity: cartItem.quantity + item.quantity,
              price: item.price,
            }
          : cartItem
      )
    : [...items, item];

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));

  return nextItems;
}

export function requestCartOpen() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CART_OPEN_EVENT));
}
