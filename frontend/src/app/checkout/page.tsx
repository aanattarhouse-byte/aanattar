"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCartItems } from "@/lib/cart";
import { getMinimumOrderStatus } from "@/lib/minimumOrder";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    const items = getCartItems();
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const { canCheckout } = getMinimumOrderStatus(items, subtotal);

    router.replace(canCheckout ? "/cart" : "/build-your-wardrobe?minimumOrder=1");
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0b0b] px-4 text-center text-white">
      <p className="text-sm font-semibold text-zinc-300">Checking checkout eligibility...</p>
    </main>
  );
}
