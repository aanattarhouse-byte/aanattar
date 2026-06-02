"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  getSalimComboAddOnQuantity,
  salimComboConfig,
  type SalimComboAddOn,
} from "@/lib/salimCombo";
import { formatPrice } from "@/lib/products";

function buildCartItem(addOn: SalimComboAddOn) {
  return {
    id: addOn.id,
    name: addOn.name,
    image: addOn.image,
    price: addOn.price,
    quantity: 1,
    variant: addOn.size,
  };
}

export default function SalimComboBuilder() {
  const { items, addItem } = useCart();

  return (
    <div className="rounded-[8px] border border-[#c0943e]/35 bg-[#fff8e7] p-4 shadow-sm">
      <div className="border-b border-[#c0943e]/25 pb-3">
        <p className="font-display text-2xl leading-none text-[#2f2110]">
          Complete Your Salim Collection
        </p>
        <p className="mt-2 text-sm font-semibold text-[#5f4218]">
          Add any 2 mini attars and get the combo for {formatPrice(salimComboConfig.offerPrice)}
        </p>
      </div>

      <div className="mt-3 grid gap-2">
        {salimComboConfig.addOns.map((addOn) => {
          const quantity = getSalimComboAddOnQuantity(items, addOn.id);

          return (
            <div
              key={addOn.id}
              className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-[8px] border border-[#d9bd7d]/45 bg-white p-2"
            >
              <span className="relative h-14 overflow-hidden rounded-[8px] bg-[#120b08]">
                <Image
                  src={addOn.image}
                  alt={addOn.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#2f2110]">
                  {addOn.name}
                </span>
                <span className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-[#8a5d12]">
                  {addOn.size} · {formatPrice(addOn.price)}
                </span>
                {quantity > 0 && (
                  <span className="mt-1 block text-xs font-semibold text-emerald-700">
                    Added x{quantity}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => addItem(buildCartItem(addOn))}
                className="inline-flex h-9 items-center justify-center gap-1 rounded-[8px] bg-[#c0943e] px-3 text-xs font-bold uppercase tracking-[0.08em] text-black transition hover:bg-[#d2a64d]"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
