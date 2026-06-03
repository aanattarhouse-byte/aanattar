"use client";

import { useState } from "react";
import Link from "next/link";
import { backendFetch } from "@/lib/backendApi";
import {
  clearCheckoutSession,
  getCheckoutSession,
  getOrderProducts,
  getShippingAddress,
  saveCheckoutSession,
  type CheckoutSession,
} from "@/lib/checkoutSession";
import { formatPrice } from "@/lib/products";
import CheckoutAddressModal from "@/components/CheckoutAddressModal";

type PaymentMethod = "COD" | "Razorpay";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayConstructorOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    contact: string;
  };
  handler: (response: RazorpayResponse) => void;
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
  };
  retry?: {
    enabled: boolean;
    max_count?: number;
  };
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayConstructorOptions) => {
      open: () => void;
      on: (event: "payment.failed", handler: (response: unknown) => void) => void;
    };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentClient() {
  const [session, setSession] = useState<CheckoutSession | null>(() =>
    getCheckoutSession()
  );
  const [addressOpen, setAddressOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const refreshSession = () => {
    setAddressOpen(false);
    setSession(getCheckoutSession());
  };

  const createCodOrder = async () => {
    if (!session) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const result = await backendFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: session.finalAmount,
          products: getOrderProducts(session),
          shippingAddress: getShippingAddress(session),
          paymentMethod: "COD",
          paymentStatus: "Pending",
        }),
      });

      clearCheckoutSession();
      setStatusMessage(
        result?.order?._id
          ? `Order confirmed. Order ID: ${result.order._id}`
          : "Order confirmed."
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not confirm the order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const payWithRazorpay = async () => {
    if (!session) {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Could not load Razorpay checkout. Please try again.");
      }

      const paymentOrder = await backendFetch("/api/orders/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: session.finalAmount,
          products: getOrderProducts(session),
          shippingAddress: getShippingAddress(session),
          paymentMethod: "Razorpay",
          paymentStatus: "Pending",
          localOrderId: session.localOrderId,
        }),
      });

      const nextSession = {
        ...session,
        localOrderId: paymentOrder.order?._id || session.localOrderId,
        razorpayOrderId: paymentOrder.razorpayOrder.id,
      };
      saveCheckoutSession(nextSession);
      setSession(nextSession);

      const razorpay = new window.Razorpay({
        key: paymentOrder.key,
        amount: paymentOrder.razorpayOrder.amount,
        currency: "INR",
        name: "Salim Luxury Attar",
        description: "Salim Luxury Attar Order",
        order_id: paymentOrder.razorpayOrder.id,
        prefill: {
          name: session.receiverName,
          contact: session.mobile,
        },
        handler: async (response) => {
          setIsVerifying(true);
          try {
            const result = await backendFetch("/api/orders/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                amount: session.finalAmount,
                products: getOrderProducts(session),
                shippingAddress: getShippingAddress(session),
                paymentMethod: "Razorpay",
              }),
            });

            clearCheckoutSession();
            setStatusMessage(
              result?.order?._id
                ? `Payment successful. Order ID: ${result.order._id}`
                : "Payment successful. Order confirmed."
            );
          } catch (error) {
            setStatusMessage(
              error instanceof Error
                ? error.message
                : "Payment verified, but order creation failed."
            );
          } finally {
            setIsVerifying(false);
            setIsSubmitting(false);
          }
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        modal: {
          ondismiss: () => {
            setStatusMessage("Payment was not completed. You can click Pay Now to retry.");
            setIsVerifying(false);
            setIsSubmitting(false);
          },
        },
        theme: {
          color: "#D4A24C",
        },
      });

      razorpay.on("payment.failed", () => {
        setStatusMessage("Payment failed. Your order is still pending payment, and you can retry now.");
        setIsVerifying(false);
        setIsSubmitting(false);
      });

      razorpay.open();
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Could not start Razorpay payment."
      );
      setIsVerifying(false);
      setIsSubmitting(false);
    }
  };

  const confirmOrder = () => {
    if (paymentMethod === "COD") {
      createCodOrder();
      return;
    }

    payWithRazorpay();
  };

  if (!session) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] px-4 py-16 text-white">
        <div className="mx-auto max-w-2xl rounded-[8px] border border-white/10 bg-white/[0.04] p-6 text-center">
          <h1 className="text-2xl font-semibold">No checkout session found</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Add your delivery address from the cart before choosing payment.
          </p>
          <Link
            href="/cart"
            className="mt-6 inline-flex h-11 items-center rounded-[8px] bg-[#D4A24C] px-5 text-xs font-bold uppercase tracking-[0.12em] text-black"
          >
            Back To Cart
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
          Step 2
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Payment Method</h1>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <section className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Delivery Address</h2>
                  <div className="mt-3 space-y-1 text-sm text-zinc-200">
                    <p className="font-semibold text-white">{session.receiverName}</p>
                    <p>{session.mobile}</p>
                    {session.alternateMobile && <p>{session.alternateMobile}</p>}
                    <p>{session.house}</p>
                    <p>{session.street}</p>
                    {session.landmark && <p>{session.landmark}</p>}
                    <p>{session.city}</p>
                    <p>{session.state}</p>
                    <p>{session.pincode}</p>
                    <p>{session.country || "India"}</p>
                    {session.deliveryInstructions && (
                      <p className="pt-2 text-xs text-zinc-400">
                        {session.deliveryInstructions}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddressOpen(true)}
                  className="shrink-0 rounded-[8px] border border-amber-300/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-amber-100 transition hover:bg-white/10"
                >
                  Change Address
                </button>
              </div>
            </section>

            <section className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="mt-4 grid gap-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-white/10 bg-black/20 p-4 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  Cash On Delivery
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-white/10 bg-black/20 p-4 text-sm">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                  />
                  Online Payment (UPI, Cards, Net Banking, Wallets)
                </label>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[8px] border border-amber-300/20 bg-[#1a120d] p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-5 space-y-3 border-y border-white/10 py-4 text-sm text-zinc-300">
              <div className="space-y-3">
                {session.cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.variant || "default"}-${item.volume || "volume"}`}
                    className="flex justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      {item.volume && (
                        <p className="mt-1 text-xs text-zinc-400">
                          Volume: {item.volume.replace("ml", " ml")}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-zinc-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-amber-100">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(session.subtotal)}</span>
              </div>
              {session.discount > 0 && (
                <div className="flex justify-between text-emerald-200">
                  <span>Combo Discount</span>
                  <span>-{formatPrice(session.discount)}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between text-base font-bold">
              <span>Final Total</span>
              <span>{formatPrice(session.finalAmount)}</span>
            </div>
            <button
              type="button"
              onClick={confirmOrder}
              disabled={isSubmitting}
              className="mt-6 h-12 w-full rounded-[8px] bg-[#D4A24C] text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#E0B35A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paymentMethod === "COD"
                ? isSubmitting ? "Confirming..." : "Confirm Order"
                : isVerifying ? "Verifying Payment..." : isSubmitting ? "Opening Payment..." : "Pay Now"}
            </button>
            {statusMessage && (
              <p className="mt-4 rounded-[8px] border border-white/10 bg-white/[0.06] p-3 text-xs text-zinc-100">
                {statusMessage}
              </p>
            )}
          </aside>
        </div>
      </div>

      {addressOpen && (
        <CheckoutAddressModal
          items={session.cartItems}
          subtotal={session.subtotal}
          discount={session.discount}
          finalAmount={session.finalAmount}
          initialSession={session}
          onClose={refreshSession}
        />
      )}
    </main>
  );
}
