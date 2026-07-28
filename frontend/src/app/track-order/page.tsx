"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { backendFetch } from "@/lib/backendApi";
import type { Order, OrderStatus } from "@/types/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, Search, ArrowRight, ShoppingBag, 
  Calendar, CreditCard, ChevronRight, AlertTriangle
} from "lucide-react";

const statusColors: Record<OrderStatus, string> = {
  "Order Placed": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  "Pending": "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  "Confirmed": "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  "Processing": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  "Packed": "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  "Shipped": "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  "Out for Delivery": "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  "Delivered": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  "Cancelled": "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function TrackOrderLandingPage() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderIdQuery = searchParams.get("orderId")?.trim();
    if (orderIdQuery && /^[0-9a-fA-F]{24}$/.test(orderIdQuery)) {
      router.replace(`/track-order/${orderIdQuery}`);
      return;
    }

    if (user) {
      const fetchRecentOrders = async () => {
        setLoadingRecent(true);
        try {
          const result = await backendFetch("/api/orders/my?page=1&limit=5");
          if (result.success && result.orders) {
            setRecentOrders(result.orders);
          }
        } catch (err) {
          console.error("Failed to fetch recent orders:", err);
        } finally {
          setLoadingRecent(false);
        }
      };
      fetchRecentOrders();
    }
  }, [router, user]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  }

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = orderIdInput.trim();
    if (!id) {
      setValidationError("Please enter an Order ID.");
      return;
    }
    // Validate MongoDB ObjectId format (24 hex characters)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isObjectId) {
      setValidationError("Order ID must be a valid 24-character hexadecimal code.");
      return;
    }

    setValidationError(null);
    router.push(`/track-order/${id}`);
  };

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

  return (
    <main className="min-h-screen bg-[#0B0B0B] py-16 px-4 sm:px-6 lg:px-8 text-white font-sans">
      <div className="mx-auto max-w-3xl">
        
        {/* Track Form Card */}
        <div className="rounded-2xl border border-[#e5d8c3]/10 bg-white/[0.01] p-8 md:p-12 backdrop-blur-sm shadow-2xl mb-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#B88A3D]/20 bg-[#B88A3D]/5 mb-6">
            <Search size={24} className="text-[#B88A3D]" />
          </div>
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Track Your Order</h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Enter your 24-character Order ID (found in your confirmation email, SMS, or profile dashboard) to view its shipping status and delivery timeline.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => {
                    setOrderIdInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="Enter 24-character Order ID (e.g. 64f7b2...)"
                  className="w-full h-12 pl-4 pr-4 bg-zinc-900/60 border border-zinc-800 focus:border-[#B88A3D] rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition duration-200"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-6 rounded-xl bg-[#B88A3D] hover:bg-[#c0943e] font-semibold text-black transition duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Track Order <ArrowRight size={16} />
              </button>
            </div>
            {validationError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-400 font-medium">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </form>
        </div>

        {/* Recent Orders Section */}
        <div className="rounded-2xl border border-[#e5d8c3]/10 bg-white/[0.01] p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold font-display text-white mb-6 flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#B88A3D]" /> Recent Purchased Orders
          </h2>

          {loadingRecent ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              <div className="h-5 w-5 animate-spin rounded-full border border-[#B88A3D] border-t-transparent mx-auto mb-2"></div>
              Loading orders...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No recent orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((ord) => {
                const dateStr = new Date(ord.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                });
                const statusBadge = statusColors[ord.orderStatus] || "bg-zinc-800 text-zinc-300 border border-zinc-700/50";

                return (
                  <div 
                    key={ord._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800/80 transition duration-300 gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-zinc-300 select-all">{ord._id}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBadge}`}>
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-zinc-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {dateStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard size={12} /> {formatCurrency(ord.amount)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/track-order/${ord._id}`}
                      className="self-start sm:self-center h-9 px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      Track Details <ChevronRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
