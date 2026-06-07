"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, use } from "react";
import { backendFetch } from "@/lib/backendApi";
import type { Order } from "@/types/store";
import Link from "next/link";
import { ArrowLeft, Printer, AlertTriangle } from "lucide-react";

interface InvoicePageProps {
  params: Promise<{ orderId: string }>;
}

export default function InvoicePage({ params }: InvoicePageProps) {
  const { orderId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const result = await backendFetch(`/api/orders/${orderId}`);
        if (result.success && result.order) {
          setOrder(result.order);
        } else {
          throw new Error(result.message || "Failed to load order");
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Could not fetch details.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [user, orderId]);

  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order]);

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
        <div className="w-full max-w-md border border-[#e5d8c3]/20 bg-white/[0.02] p-8 text-center rounded-2xl">
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="mt-2 text-sm text-zinc-400">Please sign in to view and print invoices.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0B0B0B] text-white">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#B88A3D] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs text-zinc-400">Preparing Invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0B0B0B] px-4 text-white">
        <div className="w-full max-w-md border border-red-500/20 bg-red-500/5 p-8 text-center rounded-2xl">
          <AlertTriangle size={36} className="text-red-500 mx-auto" />
          <h2 className="mt-4 font-display text-xl font-bold text-white">Invoice Error</h2>
          <p className="mt-2 text-sm text-zinc-300">{error || "Could not prepare the invoice sheet."}</p>
          <Link
            href="/my-orders"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-800 px-6 text-xs font-bold uppercase tracking-wider hover:bg-zinc-700 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const taxRate = 0.18;
  const subtotal = order.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gstAmount = subtotal * taxRate;
  const deliveryCharges = Math.max(0, order.amount - subtotal);

  return (
    <div className="min-h-screen bg-[#0E0E0E] py-10 px-4 text-zinc-800 print:bg-white print:p-0 print:text-black font-sans">
      <div className="mx-auto max-w-3xl mb-6 flex items-center justify-between border-b border-zinc-800 pb-4 print:hidden">
        <Link
          href="/my-orders"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B88A3D] hover:underline"
        >
          <ArrowLeft size={14} /> Back to My Orders
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#B88A3D] px-5 text-xs font-bold text-black hover:bg-[#c0943e] transition"
        >
          <Printer size={14} /> Print Invoice
        </button>
      </div>

      <div className="mx-auto max-w-3xl bg-white p-8 sm:p-12 shadow-2xl rounded-xl border border-zinc-200 print:shadow-none print:border-none print:rounded-none">
        <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-zinc-200 pb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#2A1B12] font-display">Aan Attar</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1 text-[#B88A3D]">Premium Fragrance House</p>
            <p className="text-xs text-zinc-500 mt-3 font-medium">
              102, Salim Luxury Heights,<br />
              Oudh Street, Fragrance Lane,<br />
              Mumbai, MH, 400001, India<br />
              support@aanattar.com
            </p>
          </div>
          <div className="sm:text-right">
            <h2 className="text-3xl font-light uppercase tracking-wider text-zinc-400">Tax Invoice</h2>
            <div className="mt-4 space-y-1 text-xs text-zinc-600 font-medium">
              <p>Invoice ID: <span className="font-mono text-zinc-900 font-bold">{order._id.substring(order._id.length - 12).toUpperCase()}</span></p>
              <p>Order ID: <span className="font-mono text-zinc-900">{order._id}</span></p>
              <p>Date: <span className="text-zinc-900">{formatDate(order.createdAt)}</span></p>
              <p>Payment Method: <span className="text-zinc-900">{order.paymentMethod || "COD"}</span></p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 py-8 border-b border-zinc-200 text-xs">
          <div>
            <h3 className="font-bold text-zinc-800 uppercase tracking-wider mb-2">Billed To (Customer)</h3>
            <p className="font-semibold text-zinc-900">{order.shippingAddress.fullName}</p>
            {user.email && <p>{user.email}</p>}
            <p>{order.shippingAddress.phone}</p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 uppercase tracking-wider mb-2">Shipping Destination</h3>
            <p className="font-semibold text-zinc-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p className="mt-1 text-zinc-600">
              {[order.shippingAddress.line1, order.shippingAddress.line2].filter(Boolean).join(", ")}
            </p>
            <p className="text-zinc-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - <span className="font-bold text-zinc-900">{order.shippingAddress.pincode}</span>
            </p>
            <p className="text-zinc-600">{order.shippingAddress.country || "India"}</p>
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse mt-8">
          <thead>
            <tr className="border-b-2 border-zinc-300 text-zinc-800 uppercase tracking-wider font-bold">
              <th className="py-3">Fragrance Product Description</th>
              <th className="py-3 text-center">Volume</th>
              <th className="py-3 text-center">Qty</th>
              <th className="py-3 text-right">Unit Price</th>
              <th className="py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {order.products.map((item, idx) => (
              <tr key={idx} className="text-zinc-700 font-medium">
                <td className="py-4">
                  <span className="font-semibold text-zinc-955 block">{item.name}</span>
                  {item.variant && item.variant !== item.volume && <span className="text-[10px] text-zinc-500 block">Variant: {item.variant}</span>}
                </td>
                <td className="py-4 text-center">{item.volume ? item.volume.replace("ml", " ml") : "-"}</td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                <td className="py-4 text-right font-semibold text-zinc-900">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-8 border-t-2 border-zinc-200 text-xs">
          <div className="max-w-xs text-zinc-500 leading-normal">
            <p className="font-bold text-zinc-700 uppercase tracking-wider mb-2">Terms & Conditions</p>
            <p>This is a computer-generated tax invoice. No physical signature is required under standard e-commerce regulations.</p>
            <p className="mt-2">For support, please query using the Order ID or email billing@aanattar.com.</p>
          </div>
          <div className="sm:text-right min-w-[200px] space-y-2 font-medium">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal (Excl. Tax)</span>
              <span>{formatCurrency(subtotal - gstAmount)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>IGST / CGST (18%)</span>
              <span>{formatCurrency(gstAmount)}</span>
            </div>
            {deliveryCharges > 0 && (
              <div className="flex justify-between text-zinc-600">
                <span>Shipping Charges</span>
                <span>{formatCurrency(deliveryCharges)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-300">
              <span>Grand Total</span>
              <span>{formatCurrency(order.amount)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-between items-end text-[10px] text-zinc-500">
          <div>
            <p>Invoice issued by:</p>
            <p className="font-bold text-zinc-800 mt-1 uppercase">Aan Attar House Billing Dept.</p>
          </div>
          <div className="text-right">
            <div className="h-10 w-24 border-b border-zinc-300 mb-2"></div>
            <p>Authorized Signature Representative</p>
          </div>
        </div>
      </div>
    </div>
  );
}
