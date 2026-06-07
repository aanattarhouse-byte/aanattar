"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Mail, Calendar, ShieldCheck, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#0B0B0B] text-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B88A3D] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-[#B88A3D] uppercase">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[#0B0B0B] px-4 text-white">
        <div className="w-full max-w-md border border-[#e5d8c3]/20 bg-white/[0.02] p-8 text-center rounded-2xl backdrop-blur-md shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#B88A3D]/30 bg-[#B88A3D]/10">
            <User size={30} className="text-[#B88A3D]" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-white">Access Your Account</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to view your profile, manage your shipping addresses, and check order history.
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
      <div className="mx-auto max-w-4xl">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B88A3D] block mb-2">Fragrance House Member</span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white mb-8">My Profile</h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Details Card */}
          <div className="md:col-span-1 rounded-2xl border border-[#e5d8c3]/15 bg-white/[0.02] p-6 text-center backdrop-blur-md shadow-lg h-fit">
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-[#B88A3D] bg-zinc-800">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "Avatar"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <User className="m-auto h-12 w-12 text-[#B88A3D]" />
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold text-white font-display">{user.displayName}</h2>
            <span className="inline-block mt-1.5 px-3 py-1 rounded-full bg-[#B88A3D]/10 text-[10px] font-bold uppercase tracking-widest text-[#B88A3D] border border-[#B88A3D]/20">
              {user.role === "admin" ? "House Admin" : "Vanguard Client"}
            </span>

            <div className="mt-8 space-y-4 text-left border-t border-[#e5d8c3]/10 pt-6">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <Mail size={16} className="text-[#B88A3D] shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <ShieldCheck size={16} className="text-[#B88A3D] shrink-0" />
                <span>Verified Client Account</span>
              </div>
            </div>
          </div>

          {/* User Addresses and Quick links */}
          <div className="md:col-span-2 space-y-6">
            <section className="rounded-2xl border border-[#e5d8c3]/15 bg-white/[0.02] p-6 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-3 border-b border-[#e5d8c3]/10 pb-4 mb-4">
                <MapPin className="text-[#B88A3D]" size={20} />
                <h3 className="text-lg font-bold font-display text-white">Delivery Addresses</h3>
              </div>
              
              <div className="rounded-xl border border-dashed border-[#e5d8c3]/20 bg-white/[0.01] p-6 text-center text-zinc-400 text-sm">
                <p>Saved shipping addresses will be shown here upon checkout completion.</p>
                <Link
                  href="/build-your-signature"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#B88A3D] uppercase tracking-wider hover:underline"
                >
                  Start Shopping <ArrowRight size={12} />
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5d8c3]/15 bg-white/[0.02] p-6 backdrop-blur-md shadow-lg">
              <h3 className="text-lg font-bold font-display text-white mb-4">Aan Attar Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  href="/my-orders"
                  className="block p-4 rounded-xl border border-[#e5d8c3]/10 bg-white/[0.02] hover:border-[#B88A3D]/50 transition duration-300"
                >
                  <h4 className="font-semibold text-[#B88A3D]">Order History</h4>
                  <p className="mt-1 text-xs text-zinc-400">View and track your previous fragrance purchases.</p>
                </Link>
                <Link 
                  href="/build-your-signature"
                  className="block p-4 rounded-xl border border-[#e5d8c3]/10 bg-white/[0.02] hover:border-[#B88A3D]/50 transition duration-300"
                >
                  <h4 className="font-semibold text-[#B88A3D]">Signature Blend Builder</h4>
                  <p className="mt-1 text-xs text-zinc-400">Craft a bespoke bottle of luxury attar.</p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
