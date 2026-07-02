"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  addCartItem,
  getCartItems,
  type CartItem,
} from "@/lib/cart";
import {
  isSalimComboBaseItem,
  isSalimComboMiniItem,
  salimComboConfig,
} from "@/lib/salimCombo";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  wardrobeFlow: WardrobeFlow | null;
  addItem: (item: CartItem, selectedAddOnIds?: string[]) => void;
  updateQuantity: (id: string, quantity: number, variant?: string, volume?: string) => void;
  removeItem: (id: string, variant?: string, volume?: string) => void;
  startWardrobeFlow: (flow?: WardrobeFlow) => void;
  clearWardrobeFlow: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export type WardrobeFlow = {
  source: "cart";
  minimumRequired: number;
};

const WARDROBE_FLOW_STORAGE_KEY = "aanstory_wardrobe_flow";

function getWardrobeFlow() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(WARDROBE_FLOW_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as WardrobeFlow;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wardrobeFlow, setWardrobeFlow] = useState<WardrobeFlow | null>(() =>
    getWardrobeFlow()
  );

  useEffect(() => {
    const syncCart = () => setItems(getCartItems());

    syncCart();

    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const saveItems = useCallback((nextItems: CartItem[]) => {
    setItems(nextItems);
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }, []);

  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const addItem = useCallback(
    (item: CartItem, selectedAddOnIds?: string[]) => {
      let nextItems = items;

      if (isSalimComboBaseItem(item)) {
        const addOnIds = selectedAddOnIds ?? salimComboConfig.addOns.map((a) => a.id);
        const addOnsToAdd = salimComboConfig.addOns.filter((addOn) =>
          addOnIds.includes(addOn.id)
        );

        nextItems = addCartItem(item, nextItems);
        for (const addOn of addOnsToAdd) {
          nextItems = addCartItem(
            {
              id: addOn.id,
              name: addOn.name,
              image: addOn.image,
              price: addOn.price,
              quantity: item.quantity,
              variant: "Salim Combo",
              volume: addOn.size.toLowerCase(),
            },
            nextItems
          );
        }
      } else {
        nextItems = addCartItem(item, nextItems);
      }

      setItems(nextItems);
    },
    [items]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number, variant?: string, volume?: string) => {
      saveItems(
        items.map((item) =>
          item.id === id && item.variant === variant && item.volume === volume
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
    },
    [items, saveItems]
  );

  const removeItem = useCallback(
    (id: string, variant?: string, volume?: string) => {
      const itemToRemove = items.find(
        (item) =>
          item.id === id && item.variant === variant && item.volume === volume
      );

      saveItems(
        items.filter(
          (item) => {
            if (itemToRemove && isSalimComboBaseItem(itemToRemove)) {
              return !isSalimComboBaseItem(item) && !isSalimComboMiniItem(item);
            }

            return item.id !== id || item.variant !== variant || item.volume !== volume;
          }
        )
      );
    },
    [items, saveItems]
  );

  const startWardrobeFlow = useCallback((flow: WardrobeFlow = { source: "cart", minimumRequired: 2 }) => {
      setWardrobeFlow(flow);
      window.localStorage.setItem(WARDROBE_FLOW_STORAGE_KEY, JSON.stringify(flow));
  }, []);

  const clearWardrobeFlow = useCallback(() => {
      setWardrobeFlow(null);
      window.localStorage.removeItem(WARDROBE_FLOW_STORAGE_KEY);
  }, []);

  const value: CartContextValue = useMemo(
    () => ({
      items,
      count,
      subtotal,
      wardrobeFlow,
      addItem,
      updateQuantity,
      removeItem,
      startWardrobeFlow,
      clearWardrobeFlow,
    }),
    [
      items,
      count,
      subtotal,
      wardrobeFlow,
      addItem,
      updateQuantity,
      removeItem,
      startWardrobeFlow,
      clearWardrobeFlow,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
