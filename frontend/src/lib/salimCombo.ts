import type { CartItem } from "@/lib/cart";

export type SalimComboAddOn = {
  id: string;
  name: string;
  size: string;
  price: number;
  image: string;
};

export const salimComboConfig = {
  baseProductSlug: "salim-luxury-attar",
  offerPrice: 799,
  requiredMiniQuantity: 2,
  addOns: [
    {
      id: "salim-5ml-mini",
      name: "Salim 5ML Mini",
      size: "5ML",
      price: 200,
      image: "/salim2.jpg",
    },
    {
      id: "gifting-5ml",
      name: "Gifting 5ML",
      size: "5ML",
      price: 200,
      image: "/salim2.jpg",
    },
  ],
} satisfies {
  baseProductSlug: string;
  offerPrice: number;
  requiredMiniQuantity: number;
  addOns: SalimComboAddOn[];
};

const eligibleMiniIds = new Set(salimComboConfig.addOns.map((addOn) => addOn.id));

export function isSalimComboBaseItem(item: CartItem) {
  return item.slug === salimComboConfig.baseProductSlug;
}

export function isSalimComboMiniItem(item: CartItem) {
  return eligibleMiniIds.has(item.id);
}

export function getSalimComboCartItems(item: CartItem) {
  if (!isSalimComboBaseItem(item)) {
    return [item];
  }

  return [
    item,
    ...salimComboConfig.addOns.map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      image: addOn.image,
      price: addOn.price,
      quantity: item.quantity,
      variant: "Salim Combo",
      volume: addOn.size.toLowerCase(),
    })),
  ] satisfies CartItem[];
}

export function getSalimComboAddOnQuantity(items: CartItem[], addOnId: string) {
  return items
    .filter((item) => item.id === addOnId)
    .reduce((total, item) => total + item.quantity, 0);
}

export function getSalimComboState(items: CartItem[]) {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const baseItem = items.find(isSalimComboBaseItem);
  const miniItems = items.filter(isSalimComboMiniItem);
  const miniQuantity = miniItems.reduce((total, item) => total + item.quantity, 0);
  const comboCount = baseItem
    ? Math.min(
        baseItem.quantity,
        Math.floor(miniQuantity / salimComboConfig.requiredMiniQuantity)
      )
    : 0;

  if (!baseItem || comboCount < 1) {
    return {
      active: false,
      subtotal,
      discount: 0,
      finalTotal: subtotal,
      miniQuantity,
      comboCount,
      savedAmount: 0,
    };
  }

  let remainingMiniUnits = salimComboConfig.requiredMiniQuantity * comboCount;
  let selectedMiniTotal = 0;

  for (const item of miniItems) {
    if (remainingMiniUnits <= 0) {
      break;
    }

    const selectedQuantity = Math.min(item.quantity, remainingMiniUnits);
    selectedMiniTotal += selectedQuantity * item.price;
    remainingMiniUnits -= selectedQuantity;
  }

  const regularComboTotal = baseItem.price * comboCount + selectedMiniTotal;
  const discount = Math.max(
    0,
    regularComboTotal - salimComboConfig.offerPrice * comboCount
  );

  return {
    active: discount > 0,
    subtotal,
    discount,
    finalTotal: subtotal - discount,
    miniQuantity,
    comboCount,
    savedAmount: discount,
  };
}
