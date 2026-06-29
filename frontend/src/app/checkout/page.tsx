"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cart");
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0b0b] px-4 text-center text-white">
      <p className="text-sm font-semibold text-zinc-300">Checking checkout eligibility...</p>
    </main>
  );
}
