"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, use } from "react";
import { backendFetch } from "@/lib/backendApi";
import type { Order, OrderStatus } from "@/types/store";
import Link from "next/link";
import { 
  ArrowLeft, Clock, MapPin, Package, ShoppingBag, 
  Truck, CheckCircle, RefreshCw, AlertTriangle
} from "lucide-react";
import Image from "next/image";

const timelineStatuses: OrderStatus[] = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

const statusDetails: Record<OrderStatus, { title: string; desc: string; step: number }> = {
  "Order Placed": { title: "Order Placed", desc: "We have received your purchase request.", step: 0 },
  "Pending": { title: "Payment Pending", desc: "Awaiting payment verification.", step: 0 },
  "Confirmed": { title: "Order Confirmed", desc: "Your order is confirmed and details verified.", step: 1 },
  "Processing": { title: "Processing Scent", desc: "Our scent masters are assembling your items.", step: 2 },
  "Packed": { title: "Packed & Sealed", desc: "Order packaged in our signature luxury boxes.", step: 3 },
  "Shipped": { title: "In Transit", desc: "Dispatched from house. Bound for your delivery city.", step: 4 },
  "Out for Delivery": { title: "Out for Delivery", desc: "Local delivery agent is bringing it to your door.", step: 5 },
  "Delivered": { title: "Delivered", desc: "Order delivered. Welcome to the Aan Attar experience.", step: 6 },
  "Cancelled": { title: "Cancelled", desc: "This order has been cancelled.", step: -1 }
};

interface TrackOrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default function TrackOrderPage({ params }: TrackOrderPageProps) {
  const { orderId } = use(params);
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(true);

  const fetchOrderDetails = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const result = await backendFetch(`/api/orders/${orderId}`);
      if (result.success && result.order) {
        setOrder(result.order);
        setError(null);
        if (result.order.orderStatus === "Delivered" || result.order.orderStatus === "Cancelled") {
          setPollingActive(false);
        }
      } else {
        throw new Error(result.message || "Failed to load order details");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Could not fetch details.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderDetails(true);
    }
  }, [user, orderId]);

  useEffect(() => {
    if (!user || !pollingActive || error) return;

    const interval = setInterval(() => {
      fetchOrderDetails(false);
    }, 6000);

    return () => clearInterval(interval);
  }, [user, pollingActive, error]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0B0B0B] text-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B88A3D] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-[#B88A3D] uppercase">Loading Account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[#0B0B0B] px-4 text-white">
        <div className="w-full max-w-md border border-[#e5d8c3]/20 bg-white/[0.02] p-8 text-center rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#B88A3D]/30 bg-[#B88A3D]/10">
            <Package size={30} className="text-[#B88A3D]" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-white">Track Your Order</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to access real-time delivery timelines and details for your purchased orders.
          </p>
          <button
            onClick={loginWithGoogle}
            className="mt-8 flex w-full h-12 items-center justify-center gap-3 rounded-lg bg-[#B88A3D] font-semibold text-black hover:bg-[#c0943e] transition duration-300 active:scale-[0.98]"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#000000"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
              />
              <path
                fill="#000000"
                d="M23.04 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.19c-.268 1.419-1.07 2.619-2.277 3.428l3.523 2.732c2.06-1.9 3.24-4.7 3.24-8.287Z"
              />
              <path
                fill="#000000"
                d="M5.266 14.235A7.108 7.108 0 0 1 4.909 12c0-.79.13-1.554.357-2.265L1.24 6.62A11.96 11.96 0 0 0 0 12c0 1.92.454 3.736 1.24 5.35l4.026-3.115Z"
              />
              <path
                fill="#000000"
                d="M12 24c3.24 0 5.96-1.073 7.945-2.909l-3.523-2.732c-.977.655-2.227 1.05-3.664 1.05-2.822 0-5.218-1.905-6.068-4.473L.664 18.05A11.97 11.97 0 0 0 12 24Z"
              />
            </svg>
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0B0B0B] text-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B88A3D] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-[#B88A3D] uppercase">Locating Order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0B0B0B] px-4 text-white">
        <div className="w-full max-w-md border border-red-500/20 bg-red-500/5 p-8 text-center rounded-2xl">
          <AlertTriangle size={36} className="text-red-500 mx-auto" />
          <h2 className="mt-4 font-display text-xl font-bold text-white">Tracking Error</h2>
          <p className="mt-2 text-sm text-zinc-300 font-medium">
            {error || "We could not find the specified order record in your account history."}
          </p>
          <Link
            href="/my-orders"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-800 px-6 text-xs font-bold uppercase tracking-wider hover:bg-zinc-700 transition"
          >
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = order.orderStatus;
  const statusInfo = statusDetails[currentStatus] || { title: currentStatus, desc: "", step: 0 };
  const currentStep = statusInfo.step;
  const isOrderCancelled = currentStatus === "Cancelled";

  const orderDate = new Date(order.createdAt);
  const estDeliveryDate = new Date(orderDate);
  estDeliveryDate.setDate(orderDate.getDate() + 4);
  const estDeliveryFormatted = estDeliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  const trackingId = `AT-${order._id.substring(order._id.length - 8).toUpperCase()}`;

  return (
    <main className="min-h-screen bg-[#0B0B0B] py-16 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/my-orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#B88A3D] uppercase tracking-wider hover:underline mb-8"
        >
          <ArrowLeft size={14} /> Back to My Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs text-zinc-400 font-medium">Tracking Order ID</span>
            <h1 className="font-mono text-lg font-bold text-white mt-0.5 select-all">{order._id}</h1>
          </div>
          {pollingActive && (
            <div className="flex items-center gap-2 self-start sm:self-center bg-zinc-955 border border-[#B88A3D]/25 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#B88A3D]">
              <RefreshCw size={11} className="animate-spin text-[#B88A3D]" />
              Real-time updates active
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          <div className="rounded-xl border border-[#e5d8c3]/10 bg-white/[0.02] p-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Status</span>
            <span className={`text-sm font-semibold block uppercase tracking-wider ${isOrderCancelled ? "text-red-400" : "text-[#B88A3D]"}`}>
              {statusInfo.title}
            </span>
            <span className="text-xs text-zinc-400 mt-1 block leading-normal">{statusInfo.desc}</span>
          </div>

          <div className="rounded-xl border border-[#e5d8c3]/10 bg-white/[0.02] p-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Estimated Delivery</span>
            <span className="text-sm font-semibold text-white block">
              {isOrderCancelled ? "No estimate available" : estDeliveryFormatted}
            </span>
            <span className="text-xs text-zinc-400 mt-1 block">Subject to transit courier speed.</span>
          </div>

          <div className="rounded-xl border border-[#e5d8c3]/10 bg-white/[0.02] p-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Tracking Reference</span>
            <span className="font-mono text-sm font-semibold text-white block">
              {isOrderCancelled ? "Not generated" : trackingId}
            </span>
            <span className="text-xs text-zinc-400 mt-1 block">Aan Attar Logistics.</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5d8c3]/10 bg-white/[0.01] p-8 mb-10 backdrop-blur-sm">
          <h2 className="text-lg font-bold font-display text-white mb-8">Delivery Timeline</h2>

          {isOrderCancelled ? (
            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-5 text-center text-red-400 text-sm">
              <p className="font-semibold">This order was cancelled.</p>
              <p className="mt-1 text-xs text-zinc-400">If you believe this is an error or would like to request a refund, please contact customer support.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="relative flex justify-between">
                  <div className="absolute top-[18px] left-[4%] right-[4%] h-[2px] bg-zinc-800">
                    <div 
                      className="h-full bg-[#B88A3D] transition-all duration-700 ease-out" 
                      style={{ width: `${(currentStep / (timelineStatuses.length - 1)) * 100}%` }}
                    />
                  </div>

                  {timelineStatuses.map((status, index) => {
                    const isCompleted = index <= currentStep;
                    const isActive = index === currentStep;

                    return (
                      <div key={status} className="relative z-10 flex flex-col items-center text-center w-[13%]">
                        <div 
                          className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition duration-500 ${
                            isActive 
                              ? "bg-[#B88A3D] border-[#B88A3D] text-black shadow-[0_0_15px_rgba(184,138,61,0.5)] scale-110"
                              : isCompleted
                                ? "bg-zinc-900 border-[#B88A3D] text-[#B88A3D]"
                                : "bg-[#0B0B0B] border-zinc-800 text-zinc-600"
                          }`}
                        >
                          {isCompleted ? <CheckCircle size={15} /> : <span className="text-xs font-bold">{index + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider mt-3 block ${isActive ? "text-[#B88A3D]" : isCompleted ? "text-zinc-200" : "text-zinc-600"}`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="block md:hidden space-y-6 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
                {timelineStatuses.map((status, index) => {
                  const isCompleted = index <= currentStep;
                  const isActive = index === currentStep;

                  return (
                    <div key={status} className="relative flex gap-4 items-start">
                      <div 
                        className={`absolute left-[-20px] h-6 w-6 rounded-full flex items-center justify-center border-2 z-10 transition duration-500 ${
                          isActive 
                            ? "bg-[#B88A3D] border-[#B88A3D] text-black shadow-[0_0_10px_rgba(184,138,61,0.5)] scale-115"
                            : isCompleted
                              ? "bg-zinc-900 border-[#B88A3D] text-[#B88A3D]"
                              : "bg-[#0B0B0B] border-zinc-800 text-zinc-600"
                        }`}
                      >
                        {isCompleted ? <CheckCircle size={11} /> : <span className="text-[9px] font-bold">{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-[#B88A3D]" : isCompleted ? "text-zinc-200" : "text-zinc-500"}`}>
                          {status}
                        </h4>
                        {isActive && (
                          <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                            {statusInfo.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 rounded-2xl border border-[#e5d8c3]/10 bg-white/[0.01] p-6 h-fit">
            <h3 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-[#B88A3D]" /> Delivery Address
            </h3>
            <div className="text-sm text-zinc-300 space-y-1">
              <p className="font-bold text-white text-sm">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="pt-2">
                {[order.shippingAddress.line1, order.shippingAddress.line2].filter(Boolean).join(", ")}
              </p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p className="font-semibold">{order.shippingAddress.pincode}</p>
              {order.shippingAddress.deliveryInstructions && (
                <div className="mt-4 pt-4 border-t border-zinc-900">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Carrier Note</span>
                  <p className="text-xs italic text-zinc-400">"{order.shippingAddress.deliveryInstructions}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-[#e5d8c3]/10 bg-white/[0.01] p-6">
            <h3 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
              <Package size={16} className="text-[#B88A3D]" /> Purchased Items
            </h3>
            <div className="divide-y divide-zinc-900">
              {order.products.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#120b08] flex items-center justify-center text-zinc-600">
                          <ShoppingBag size={14} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-zinc-200 line-clamp-1">{item.name}</h4>
                      <div className="flex gap-2 mt-0.5 text-[10px] text-zinc-400">
                        {item.volume && <span>{item.volume}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-900 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200">{formatCurrency(order.amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#B88A3D] text-sm pt-2 border-t border-zinc-900/60">
                <span>Total Amount Paid</span>
                <span>{formatCurrency(order.amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
