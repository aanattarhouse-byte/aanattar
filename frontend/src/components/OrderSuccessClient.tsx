"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Clock3,
  CreditCard,
  FileText,
  Home,
  PackageCheck,
  ReceiptText,
  Truck,
} from "lucide-react";
import { backendFetch } from "@/lib/backendApi";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types/store";

type FetchState = "idle" | "loading" | "loaded" | "error";

const timelineSteps = [
  "Order Confirmed",
  "Preparing Your Order",
  "Shipped",
  "Delivered",
];

function getPaymentLabel(method?: Order["paymentMethod"]) {
  if (method === "Razorpay") return "Online Payment";
  return "Cash on Delivery";
}

function getStatusLabel(status?: Order["orderStatus"]) {
  if (!status || status === "Order Placed" || status === "Pending") return "Confirmed";
  return status;
}

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId")?.trim() || "";
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("idle");

  const confetti = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        left: `${(index * 29) % 100}%`,
        delay: `${(index % 12) * 0.12}s`,
        duration: `${2.1 + (index % 6) * 0.16}s`,
        rotate: `${(index * 47) % 180}deg`,
        color: index % 3 === 0 ? "#B88A3D" : index % 3 === 1 ? "#22C55E" : "#F8E7B0",
      })),
    []
  );

  useEffect(() => {
    if (authLoading || !orderId || !user) return;

    let mounted = true;

    async function fetchOrder() {
      setFetchState("loading");
      try {
        const result = await backendFetch(`/api/orders/${orderId}`);
        if (!mounted) return;

        if (result.success && result.order) {
          setOrder(result.order);
          setFetchState("loaded");
          return;
        }

        throw new Error(result.message || "Order details are not available yet.");
      } catch {
        if (!mounted) return;
        setFetchState("error");
      }
    }

    void fetchOrder();

    return () => {
      mounted = false;
    };
  }, [authLoading, orderId, user]);

  const displayOrderId = order?._id || orderId;
  const paymentMethod = getPaymentLabel(order?.paymentMethod);
  const orderStatus = getStatusLabel(order?.orderStatus);
  const invoiceOrderId = order?._id;

  const orderRows = [
    {
      label: "Order ID",
      value: displayOrderId || "Not available",
      icon: ReceiptText,
      mono: Boolean(displayOrderId),
    },
    {
      label: "Payment Method",
      value: paymentMethod,
      icon: CreditCard,
    },
    {
      label: "Order Status",
      value: orderStatus,
      icon: PackageCheck,
    },
    {
      label: "Estimated Delivery",
      value: "3-5 Business Days",
      icon: Truck,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0B0B] px-4 py-12 text-white sm:px-6 lg:px-8">
      <style>{`
        @keyframes order-success-pop {
          0% { opacity: 0; transform: scale(0.72); }
          62% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes order-success-pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.46), 0 0 30px rgba(34, 197, 94, 0.35); }
          100% { box-shadow: 0 0 0 22px rgba(34, 197, 94, 0), 0 0 30px rgba(34, 197, 94, 0.18); }
        }

        @keyframes order-success-fade {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes order-success-confetti {
          0% { opacity: 0; transform: translate3d(0, -24px, 0) rotate(0deg); }
          12% { opacity: 1; }
          100% { opacity: 0; transform: translate3d(26px, 92vh, 0) rotate(280deg); }
        }

        .order-success-icon {
          animation: order-success-pop 620ms cubic-bezier(.2,.9,.2,1.15) both,
            order-success-pulse 900ms ease-out 560ms 1 both;
        }

        .order-success-card {
          animation: order-success-fade 680ms ease-out 160ms both;
        }

        .order-success-confetti {
          animation-name: order-success-confetti;
          animation-timing-function: cubic-bezier(.18,.68,.35,1);
          animation-fill-mode: both;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[#B88A3D]/10 blur-3xl" />
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="order-success-confetti absolute top-0 h-3 w-1.5 rounded-full"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotate})`,
            }}
          />
        ))}
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-[600px] items-center">
        <div className="order-success-card w-full rounded-[24px] border border-[#E5D8C3]/15 bg-[#120E0A]/85 p-5 text-center shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-md sm:p-8">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-green-700 text-white shadow-[0_0_34px_rgba(34,197,94,0.35)] order-success-icon">
            <Check size={54} strokeWidth={3.4} />
          </div>

          <h1 className="mt-7 font-display text-4xl font-semibold text-white sm:text-5xl">
            Thank You!
          </h1>
          <div className="mx-auto mt-4 max-w-md space-y-2 text-sm text-zinc-300 sm:text-base">
            <p>Your order has been placed successfully.</p>
            <p>Thank you for choosing Aan Attar.</p>
            <p>We have received your order and our team will begin processing it shortly.</p>
          </div>

          {(fetchState === "loading" || authLoading) && displayOrderId && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#B88A3D]/20 bg-[#B88A3D]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#EAC87A]">
              <span className="h-3 w-3 animate-spin rounded-full border border-[#EAC87A] border-t-transparent" />
              Loading order details
            </div>
          )}

          {fetchState === "error" && displayOrderId && (
            <p className="mx-auto mt-5 max-w-sm rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">
              Your order is confirmed. Detailed tracking may take a moment to appear.
            </p>
          )}

          <div className="mt-8 rounded-[14px] border border-[#E5D8C3]/12 bg-black/[0.24] p-4 text-left sm:p-5">
            <div className="space-y-4">
              {orderRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[#B88A3D]/20 bg-[#B88A3D]/10 text-[#E0B35A]">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                        {row.label}
                      </p>
                      <p
                        className={`mt-1 break-words text-sm font-semibold text-zinc-100 ${
                          row.mono ? "font-mono text-xs sm:text-sm" : "font-sans"
                        }`}
                      >
                        {row.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-7 rounded-[14px] border border-white/10 bg-white/[0.03] p-4 text-left sm:p-5">
            <div className="space-y-4">
              {timelineSteps.map((step, index) => {
                const isCurrent = index === 0;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        isCurrent
                          ? "border-emerald-400 bg-emerald-500 text-white shadow-[0_0_14px_rgba(34,197,94,0.34)]"
                          : "border-zinc-700 bg-[#0B0B0B] text-zinc-500"
                      }`}
                    >
                      {isCurrent ? <Check size={16} strokeWidth={3} /> : <Clock3 size={13} />}
                    </div>
                    <span
                      className={`font-sans text-sm font-semibold ${
                        isCurrent ? "text-emerald-200" : "text-zinc-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <Link
              href="/"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#B88A3D] px-5 text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#D4A24C] active:scale-[0.99]"
            >
              <Home size={16} />
              Continue Shopping
            </Link>

            <Link
              href={displayOrderId ? `/track-order?orderId=${encodeURIComponent(displayOrderId)}` : "/track-order"}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-[#B88A3D]/45 px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#F0D08A] transition hover:bg-[#B88A3D]/10 active:scale-[0.99]"
            >
              <PackageCheck size={16} />
              Track Order
            </Link>

            {invoiceOrderId && (
              <Link
                href={`/my-orders/invoice/${invoiceOrderId}`}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-white/12 px-5 text-xs font-bold uppercase tracking-[0.12em] text-zinc-200 transition hover:bg-white/[0.08] active:scale-[0.99]"
              >
                <FileText size={16} />
                Download Invoice
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
