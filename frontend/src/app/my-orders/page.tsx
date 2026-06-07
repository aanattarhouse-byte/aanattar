"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useTransition } from "react";
import { backendFetch } from "@/lib/backendApi";
import { addCartItem, CART_UPDATED_EVENT, requestCartOpen } from "@/lib/cart";
import type { Order, OrderStatus } from "@/types/store";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, Search, Filter, Calendar, MapPin, 
  CreditCard, Eye, EyeOff, RefreshCw, XCircle, FileText, ChevronRight, ChevronLeft
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

export default function MyOrdersPage() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Details Toggle state
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  
  // Cancellation and reordering indicators
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", String(page));
      queryParams.set("limit", "10");
      if (status) queryParams.set("status", status);
      if (search) queryParams.set("search", search.trim());

      const result = await backendFetch(`/api/orders/my?${queryParams.toString()}`);
      if (result.success) {
        setOrders(result.orders || []);
        setTotalPages(result.pagination?.pages || 1);
      } else {
        throw new Error(result.message || "Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred while loading your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const toggleDetails = (orderId: string) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const result = await backendFetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (result.success) {
        // Refetch orders or update local state
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: "Cancelled" } : o));
      } else {
        throw new Error(result.message || "Could not cancel order");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error cancelling order");
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleReorder = async (order: Order) => {
    const orderId = order._id;
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      // 1. Sync backend cart if user wants
      await backendFetch(`/api/orders/${orderId}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      // 2. Add each item to standard client local storage cart
      for (const item of order.products) {
        const id = typeof item.product === "object" ? item.product._id : item.product;
        addCartItem({
          id: id || "",
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant || item.size,
          volume: item.volume,
        });
      }

      // 3. Request cart open in UI
      requestCartOpen();
    } catch (err) {
      console.error("Reorder failed:", err);
      alert("Could not reorder all items. Adding items locally instead.");
      
      // Fallback: Add items locally anyway
      for (const item of order.products) {
        const id = typeof item.product === "object" ? item.product._id : item.product;
        addCartItem({
          id: id || "",
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          variant: item.variant || item.size,
          volume: item.volume,
        });
      }
      requestCartOpen();
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  }

  const isCancellable = (status: OrderStatus) => {
    return ["Order Placed", "Pending", "Confirmed", "Processing", "Packed"].includes(status);
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
            <ShoppingBag size={30} className="text-[#B88A3D]" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-white">Access Your Orders</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Please sign in with your fragrance account to view your past purchases and track ongoing orders.
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
    <main className="min-h-screen bg-[#0B0B0B] py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A3D] block mb-2">Member Dashboard</span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-8">My Orders</h1>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#e5d8c3]/10 bg-white/[0.01] p-4 rounded-xl backdrop-blur-sm">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full pl-10 pr-4 bg-black/40 border border-[#e5d8c3]/20 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#B88A3D] transition duration-300"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            {search && (
              <button 
                type="button" 
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </form>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 shrink-0">
              <Filter size={14} /> Filter Status:
            </span>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-11 px-3 bg-black/40 border border-[#e5d8c3]/20 rounded-lg text-sm text-zinc-200 outline-none focus:border-[#B88A3D] transition duration-300"
            >
              <option value="">All Orders</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex py-20 justify-center items-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#B88A3D] border-t-transparent mx-auto"></div>
          </div>
        ) : error ? (
          <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-6 text-center text-red-400 text-sm">
            <p>{error}</p>
            <button 
              onClick={fetchOrders}
              className="mt-4 inline-flex items-center gap-2 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition"
            >
              Retry Load
            </button>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="border border-[#e5d8c3]/10 bg-white/[0.01] rounded-2xl p-12 text-center shadow-xl backdrop-blur-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#B88A3D]/20 bg-[#B88A3D]/5 text-[#B88A3D] mb-6">
              <ShoppingBag size={28} />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">No purchases found</h3>
            <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-8">
              You haven't placed any orders yet. Explore our luxury selection of artisanal attars, bespoke blends, and custom collections.
            </p>
            <Link
              href="/build-your-signature"
              className="inline-flex h-12 items-center justify-center px-8 rounded-lg bg-[#B88A3D] text-black font-bold hover:bg-[#c0943e] transition duration-300 shadow-md hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = !!expandedOrders[order._id];
              const isActioning = !!actionLoading[order._id];

              return (
                <div 
                  key={order._id}
                  className="rounded-xl border border-[#e5d8c3]/15 bg-white/[0.02] overflow-hidden backdrop-blur-sm shadow-md transition duration-300 hover:border-[#B88A3D]/30"
                >
                  {/* Card Header */}
                  <div className="bg-white/[0.02] border-b border-[#e5d8c3]/10 p-5 grid gap-4 sm:grid-cols-4 items-center">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Order Identifier</span>
                      <span className="font-mono text-xs font-semibold text-white block select-all">{order._id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Date Ordered</span>
                      <span className="text-sm font-medium text-zinc-200 block">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">Total Paid</span>
                      <span className="text-sm font-bold text-[#B88A3D] block">{formatCurrency(order.amount)}</span>
                    </div>
                    <div className="flex sm:justify-end gap-2 items-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.orderStatus] || "bg-zinc-800 text-zinc-300"}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Card Products */}
                  <div className="p-5 divide-y divide-zinc-800/60">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 grid grid-cols-[64px_1fr] gap-4 items-center">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-[#120b08] flex items-center justify-center">
                              <ShoppingBag size={18} className="text-zinc-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-sm text-zinc-200 line-clamp-1">{item.name}</h4>
                            <div className="flex flex-wrap gap-2.5 mt-1 text-[11px] text-zinc-400">
                              {item.volume && <span>Volume: {item.volume.replace("ml", " ml")}</span>}
                              {item.variant && item.variant !== item.volume && <span>Variant: {item.variant}</span>}
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-zinc-300">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expanded details panel */}
                  {isExpanded && (
                    <div className="bg-[#120b08]/50 border-t border-[#e5d8c3]/10 p-5 grid gap-6 md:grid-cols-2 text-xs text-zinc-300">
                      <div>
                        <h5 className="font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                          <MapPin size={12} className="text-[#B88A3D]" /> Delivery Address
                        </h5>
                        <p className="font-semibold text-zinc-200">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.phone}</p>
                        <p className="mt-1">
                          {[order.shippingAddress.line1, order.shippingAddress.line2].filter(Boolean).join(", ")}
                        </p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        {order.shippingAddress.deliveryInstructions && (
                          <p className="mt-2 text-zinc-500 italic">Instructions: "{order.shippingAddress.deliveryInstructions}"</p>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
                          <CreditCard size={12} className="text-[#B88A3D]" /> Payment Details
                        </h5>
                        <p>Method: <span className="font-semibold text-zinc-200">{order.paymentMethod || "COD"}</span></p>
                        <p>Status: <span className="font-semibold text-zinc-200">{order.paymentStatus}</span></p>
                        {order.razorpayPaymentId && <p className="font-mono mt-1 text-[10px]">Payment ID: {order.razorpayPaymentId}</p>}
                        {order.razorpayOrderId && <p className="font-mono text-[10px]">Razorpay Order ID: {order.razorpayOrderId}</p>}
                      </div>
                    </div>
                  )}

                  {/* Card Action Buttons */}
                  <div className="bg-white/[0.01] border-t border-[#e5d8c3]/10 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDetails(order._id)}
                        className="inline-flex h-9 items-center gap-1.5 px-3 rounded-lg border border-[#e5d8c3]/20 hover:border-[#B88A3D] text-xs transition duration-300"
                      >
                        {isExpanded ? (
                          <>
                            <EyeOff size={13} /> Hide Details
                          </>
                        ) : (
                          <>
                            <Eye size={13} /> View Details
                          </>
                        )}
                      </button>

                      <Link
                        href={`/my-orders/invoice/${order._id}`}
                        className="inline-flex h-9 items-center gap-1.5 px-3 rounded-lg border border-[#e5d8c3]/20 hover:border-[#B88A3D] text-xs transition duration-300"
                      >
                        <FileText size={13} /> Invoice
                      </Link>

                      <Link
                        href={`/track-order/${order._id}`}
                        className="inline-flex h-9 items-center gap-1 px-3.5 rounded-lg bg-[#B88A3D]/10 hover:bg-[#B88A3D]/20 border border-[#B88A3D]/30 hover:border-[#B88A3D]/50 text-xs font-semibold text-[#B88A3D] transition duration-300"
                      >
                        Track Order
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCancellable(order.orderStatus) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={isActioning}
                          className="inline-flex h-9 items-center gap-1 px-3.5 rounded-lg border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-400 hover:text-red-300 transition duration-300 disabled:opacity-40"
                        >
                          <XCircle size={13} /> Cancel Order
                        </button>
                      )}

                      <button
                        onClick={() => handleReorder(order)}
                        disabled={isActioning}
                        className="inline-flex h-9 items-center gap-1 px-4 py-2 rounded-lg bg-[#B88A3D] hover:bg-[#c0943e] text-xs font-bold text-black transition duration-300 active:scale-[0.98] disabled:opacity-40"
                      >
                        {isActioning ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <RefreshCw size={13} />
                        )}
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-zinc-900">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5d8c3]/20 hover:border-[#B88A3D] transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-medium text-zinc-400">
                  Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5d8c3]/20 hover:border-[#B88A3D] transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
