import { Suspense } from "react";
import OrderSuccessClient from "@/components/OrderSuccessClient";

export const metadata = {
  title: "Thank You | Aan Attar",
  description: "Your Aan Attar order has been placed successfully.",
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#0B0B0B] px-4 text-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#B88A3D] border-t-transparent" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#B88A3D]">
              Preparing Confirmation...
            </p>
          </div>
        </main>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}
