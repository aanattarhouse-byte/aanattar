"use client";

import {
  Home,
  Heart,
  LogOut,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { CART_OPEN_EVENT } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { useAuth } from "@/context/AuthContext";
import {
  getSalimComboState,
  isSalimComboBaseItem,
} from "@/lib/salimCombo";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Build Your Signature", href: "/build-your-signature" },
    { label: "Contact Us", href: "/contact" },
];

const SalimComboBuilder = dynamic(() => import("@/components/SalimComboBuilder"), {
  ssr: false,
  loading: () => null,
});

type LenisController = {
  start: () => void;
  stop: () => void;
};

function getLenis() {
  const lenis = (window as unknown as { lenis?: Partial<LenisController> }).lenis;

  if (
    lenis &&
    typeof lenis.start === "function" &&
    typeof lenis.stop === "function"
  ) {
    return lenis as LenisController;
  }

  return undefined;
}

function LoginMark({ size = 17 }: { size?: number }) {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#5d1717]/25 bg-white text-[#5d1717]">
      <User size={size} />
    </span>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function MagneticLink({
  href,
  children,
  className,
  active,
  onClick,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <div className="transition-transform duration-300 hover:-translate-y-0.5">
      <Link
        href={href}
        aria-label={ariaLabel}
        data-active={active ? "true" : "false"}
        className={className}
        onClick={onClick}
      >
        {children}
      </Link>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState<Product[]>([]);
  const { user, browserInfo, loginWithGoogle, loginWithGoogleRedirect, logout, openInSystemBrowser } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const originalOverflowRef = useRef<string>("");

  const pathname = usePathname();
  const {
    items: cartItems,
    count: cartCount,
    subtotal: cartSubtotal,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
  } = useCart();
  const salimComboState = getSalimComboState(cartItems);
  const hasSalimBaseInCart = cartItems.some(isSalimComboBaseItem);
  const cartDrawerItems = cartItems;

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return searchProducts.slice(0, 5);
    }

    return searchProducts
      .filter((product) => {
        const searchable = [
          product.name,
          product.category,
          product.shortDescription,
          product.vibe,
          product.bestFor,
          ...product.notes,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      })
      .slice(0, 6);
  }, [searchProducts, searchQuery]);
  const searchCatalogReady = searchProducts.length > 0;

  // Session persistent synchronization is managed by AuthProvider now.

  useEffect(() => {
    if (!searchOpen || searchProducts.length > 0) return;

    let cancelled = false;
    const loadProducts = () => {
      import("@/lib/products").then(({ products }) => {
        if (!cancelled) {
          setSearchProducts(products);
        }
      });
    };
    const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(loadProducts);

    return () => {
      cancelled = true;
      cancelIdle(id);
    };
  }, [searchOpen, searchProducts.length]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        loginRef.current &&
        !loginRef.current.contains(event.target as Node)
      ) {
        setLoginOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const openCart = () => {
      setOpen(false);
      setCartOpen(true);
    };

    window.addEventListener(CART_OPEN_EVENT, openCart);

    return () => window.removeEventListener(CART_OPEN_EVENT, openCart);
  }, []);

  useEffect(() => {
    if (cartOpen) {
      originalOverflowRef.current = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      getLenis()?.stop();
    } else {
      if (originalOverflowRef.current) {
        document.body.style.overflow = originalOverflowRef.current;
      }
      getLenis()?.start();
    }
    return () => {
      if (cartOpen && originalOverflowRef.current) {
        document.body.style.overflow = originalOverflowRef.current;
        getLenis()?.start();
      }
    };
  }, [cartOpen]);



  const handleGoogleLogin = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await loginWithGoogle();
      setLoginOpen(false);
      setShowLoginModal(false);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Google sign-in failed. Please try again.";
      setAuthError(message);
      if (browserInfo.isMetaInAppBrowser) {
        setLoginOpen(false);
        setShowLoginModal(true);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleRedirectLogin = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await loginWithGoogleRedirect();
    } catch (err: unknown) {
      console.error(err);
      setAuthError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await logout();
      setLoginOpen(false);
      setShowLoginModal(false);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <header className="relative z-50 w-full border-b border-black/5 bg-[#f8f3ea]">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <nav className="flex h-[78px] items-center justify-between gap-2 sm:h-[82px] sm:gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 xl:flex-none"
            onClick={() => setOpen(false)}
          >
            <span className="relative h-10 w-19 shrink-0 overflow-hidden sm:h-12 sm:w-22">
              <Image
                src="/logo1.png"
                alt="Aan Attar logo"
                fill
                sizes="98px"
                priority
                decoding="async"
                className="object-cover"
              />
            </span>

            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-display text-[0.86rem] font-semibold text-[#2A1B12] sm:text-[1.32rem]">
                Aan Attar
              </span>

              <span className="mt-1 whitespace-nowrap text-[0.34rem] font-bold uppercase tracking-[0.12em] text-[#B88A3D] min-[380px]:text-[0.4rem] min-[380px]:tracking-[0.16em] sm:text-[0.58rem] sm:tracking-[0.34em]">
                Premium Fragrance House
              </span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="ml-10 hidden items-center justify-center gap-7 xl:flex">
            {navItems.map((item) => (
              <MagneticLink
                key={item.href}
                href={item.href}
                active={pathname === item.href}
                className={`relative text-[15px] font-medium transition duration-300 ${
                  pathname === item.href
                    ? "text-[#B88A3D]"
                    : "text-[#2A1B12]"
                }`}
              >
                <span className="relative">
                  {item.label}

                  {pathname === item.href && (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-[#B88A3D]" />
                  )}
                </span>
              </MagneticLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center justify-end gap-1 sm:gap-2">
            <div ref={searchRef} className="relative hidden sm:block">
              <button
                type="button"
                aria-label="Search products"
                onClick={() => {
                  setSearchOpen((value) => !value);
                  setLoginOpen(false);
                }}
                className="
                  grid
                  h-11
                  w-11
                  place-items-center
                  rounded-full
                  text-[#5d1717]
                  transition
                  duration-300
                  hover:bg-[#5d1717]/8
                  hover:text-[#8a5f1f]
                "
              >
                <Search size={18} />
              </button>

              {searchOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+12px)]
                      w-[min(22rem,calc(100vw-2rem))]
                      overflow-hidden
                      rounded-[8px]
                      border
                      border-[#e5d8c3]
                      bg-[#fffaf3]
                      p-3
                      text-[#2A1B12]
                      shadow-[0_18px_50px_rgba(42,27,18,0.16)]
                      animate-[why-aan-reveal_0.18s_ease-out_both]
                    "
                  >
                    <label className="relative block">
                      <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7862]"
                      />
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        autoFocus
                        placeholder="Search attar, oudh, musk..."
                        className="h-11 w-full rounded-[8px] border border-[#dfd1bb] bg-white pl-9 pr-3 text-sm font-medium outline-none transition placeholder:text-[#9b8c78] focus:border-[#B88A3D]"
                      />
                    </label>

                    <div className="mt-3 max-h-[22rem] space-y-2 overflow-y-auto">
                      {!searchCatalogReady ? null : searchResults.length > 0 ? (
                        searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="grid grid-cols-[54px_1fr] gap-3 rounded-[8px] border border-transparent bg-white p-2 transition hover:border-[#D4A24C] hover:bg-[#fff7e9]"
                          >
                            <span className="relative overflow-hidden rounded-[8px] bg-[#120b08]">
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={54}
                                height={54}
                                decoding="async"
                                className="h-[54px] w-[54px] object-cover"
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold">
                                {product.name}
                              </span>
                              <span className="mt-1 block truncate text-xs text-[#7b6b57]">
                                {product.category}
                              </span>
                              <span className="mt-1 block text-xs font-bold text-[#8a5f1f]">
                                {formatPrice(product.price)}
                              </span>
                            </span>
                          </Link>
                        ))
                      ) : (
                        <p className="rounded-[8px] bg-white p-4 text-sm text-[#7b6b57]">
                          No products found.
                        </p>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div ref={loginRef} className="relative hidden xl:block">
              <button
                type="button"
                aria-label={user ? "Open account menu" : "Login"}
                onClick={() => {
                  setLoginOpen((value) => !value);
                  setAuthError("");
                }}
                className="
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-full
                  px-2
                  text-[0.72rem]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#5d1717]
                  transition
                  duration-300
                  hover:bg-[#5d1717]/8
                  hover:text-[#8a5f1f]
                  sm:px-3
                "
              >
                {user ? <User size={17} /> : <LoginMark />}
                <span className="hidden lg:inline">{user ? "Account" : ""}</span>
              </button>
 
              {loginOpen && (
                  <div
                    className="
                      absolute
                      right-[-80px]
                      sm:right-0
                      top-[calc(100%+12px)]
                      w-[calc(100vw-32px)]
                      sm:w-[320px]
                      max-w-[320px]
                      overflow-hidden
                      rounded-[12px]
                      border
                      border-[#e5d8c3]
                      bg-[#fffaf3]
                      p-4
                      text-[#2A1B12]
                      shadow-[0_18px_50px_rgba(42,27,18,0.16)]
                      animate-[why-aan-reveal_0.18s_ease-out_both]
                    "
                  >
                    {user ? (
                      <div>
                        <div className="rounded-[8px] bg-white p-3">
                          <p className="text-sm font-semibold">{user.displayName || "Fragrance Lover"}</p>
                          <p className="mt-1 truncate text-xs text-[#7b6b57]">
                            {user.email || "Welcome back"}
                          </p>
                        </div>

                        <div className="mt-2 divide-y divide-[#e5d8c3]/30 border-y border-[#e5d8c3]/30 py-1">
                          <Link
                            href="/profile"
                            onClick={() => setLoginOpen(false)}
                            className="flex items-center gap-2 py-2 px-1 text-xs font-semibold text-[#2A1B12] hover:text-[#B88A3D] transition"
                          >
                            <User size={14} className="text-[#B88A3D]" />
                            My Profile
                          </Link>
                          <Link
                            href="/my-orders"
                            onClick={() => setLoginOpen(false)}
                            className="flex items-center gap-2 py-2 px-1 text-xs font-semibold text-[#2A1B12] hover:text-[#B88A3D] transition"
                          >
                            <ShoppingBag size={14} className="text-[#B88A3D]" />
                            My Orders
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="
                            mt-2
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-[8px]
                            border
                            border-[#e5d8c3]
                            bg-white
                            text-sm
                            font-semibold
                            transition
                            hover:border-[#B88A3D]
                          "
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <div>
                          <h3 className="px-1 text-base font-semibold text-[#2A1B12] font-display">
                            Sign In
                          </h3>
                          <p className="px-1 text-xs text-[#7b6b57]">
                            Access your signature fragrance house
                          </p>
                        </div>

                        {/* Google Button */}
                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          disabled={authLoading}
                          className="
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            gap-3
                            rounded-[8px]
                            border
                            border-[#d8cbb4]
                            bg-white
                            text-sm
                            font-semibold
                            text-[#2A1B12]
                            transition
                            hover:border-[#B88A3D]
                            hover:bg-[#fff7e9]
                            active:scale-[0.98]
                            disabled:opacity-50
                          "
                        >
                          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#EA4335"
                              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                            />
                            <path
                              fill="#4285F4"
                              d="M23.04 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.19c-.268 1.419-1.07 2.619-2.277 3.428l3.523 2.732c2.06-1.9 3.24-4.7 3.24-8.287Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.266 14.235A7.108 7.108 0 0 1 4.909 12c0-.79.13-1.554.357-2.265L1.24 6.62A11.96 11.96 0 0 0 0 12c0 1.92.454 3.736 1.24 5.35l4.026-3.115Z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 24c3.24 0 5.96-1.073 7.945-2.909l-3.523-2.732c-.977.655-2.227 1.05-3.664 1.05-2.822 0-5.218-1.905-6.068-4.473L.664 18.05A11.97 11.97 0 0 0 12 24Z"
                            />
                          </svg>
                          Google
                        </button>

                        {authError && (
                          <p className="text-[11px] font-medium text-red-600 px-1 mt-1 text-center">
                            {authError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
            </div>

            <button
              type="button"
              aria-label="Search products"
              onClick={() => {
                setSearchOpen((value) => !value);
                setLoginOpen(false);
                setOpen(false);
              }}
              className="
                relative
                grid
                h-11
                w-11
                place-items-center
                rounded-full
                text-[#5d1717]
                transition
                duration-300
                hover:bg-[#5d1717]/8
                hover:text-[#8a5f1f]
                sm:hidden
              "
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              className="
                relative
                hidden
                h-11
                w-11
                place-items-center
                rounded-full
                text-[#5d1717]
                transition
                duration-300
                hover:bg-[#5d1717]/8
                hover:text-[#8a5f1f]
                sm:grid
              "
            >
              <ShoppingCart size={21} />
              <span className="absolute right-0 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#5d1717] px-1 text-[0.62rem] font-bold leading-none text-white">
                {cartCount}
              </span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
            className="
              ml-1
              grid
              h-11
              w-11
              place-items-center
              rounded-full
              border
              border-[#d8cbb4]
              bg-white
              text-[#2A1B12]
              xl:hidden
            "
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {searchOpen && (
          <div
            ref={searchRef}
            className="
              relative
              mb-3
              overflow-hidden
              rounded-[14px]
              border
              border-[#e5d8c3]
              bg-[#fffaf3]
              p-2.5
              text-[#2A1B12]
              shadow-[0_14px_34px_rgba(42,27,18,0.14)]
              animate-[why-aan-reveal_0.18s_ease-out_both]
              sm:hidden
            "
          >
            <label className="relative block">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7862]"
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoFocus
                placeholder="Search attar, oudh, musk..."
                className="h-11 w-full rounded-[8px] border border-[#dfd1bb] bg-white pl-9 pr-3 text-sm font-medium outline-none transition placeholder:text-[#9b8c78] focus:border-[#B88A3D]"
              />
            </label>

            <div className="mt-2 max-h-[17rem] space-y-2 overflow-y-auto">
              {!searchCatalogReady ? null : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="grid grid-cols-[50px_1fr] gap-3 rounded-[8px] border border-transparent bg-white p-2 transition hover:border-[#D4A24C] hover:bg-[#fff7e9]"
                  >
                    <span className="relative overflow-hidden rounded-[8px] bg-[#120b08]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={50}
                        height={50}
                        decoding="async"
                        className="h-[50px] w-[50px] object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {product.name}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[#7b6b57]">
                        {product.category}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-[#8a5f1f]">
                        {formatPrice(product.price)}
                      </span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="rounded-[8px] bg-white p-4 text-sm text-[#7b6b57]">
                  No products found.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {open && (
            <div
              className="
                mb-4
                overflow-hidden
                rounded-[24px]
                border
                border-[#e5d8c3]
                bg-white
                p-3
                shadow-lg
                animate-[why-aan-reveal_0.22s_ease-out_both]
              "
            >
              <div className="grid gap-1">
                <label className="relative mb-2 block">
                  <Search
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7862]"
                  />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products"
                    className="h-12 w-full rounded-xl border border-[#e5d8c3] bg-[#fffaf3] pl-10 pr-4 text-sm font-medium text-[#2A1B12] outline-none transition placeholder:text-[#9b8c78] focus:border-[#B88A3D]"
                  />
                </label>

                {searchQuery.trim() && (
                  <div className="mb-2 grid gap-2">
                    {!searchCatalogReady ? null : searchResults.length > 0 ? (
                      searchResults.slice(0, 4).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={() => {
                            setOpen(false);
                            setSearchQuery("");
                          }}
                          className="grid grid-cols-[48px_1fr] gap-3 rounded-xl bg-[#fffaf3] p-2 text-[#2A1B12]"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            decoding="async"
                            className="h-12 w-12 rounded-[8px] object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">
                              {product.name}
                            </span>
                            <span className="mt-1 block text-xs font-bold text-[#8a5f1f]">
                              {formatPrice(product.price)}
                            </span>
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="rounded-xl bg-[#fffaf3] p-3 text-sm text-[#7b6b57]">
                        No products found.
                      </p>
                    )}
                  </div>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-[#2A1B12]
                      transition
                      duration-300
                      hover:bg-[#f7f1e7]
                      hover:text-[#B88A3D]
                    "
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 grid gap-2">
                {user ? (
                  <div className="grid gap-2 rounded-2xl bg-[#fffaf3] border border-[#e5d8c3]/40 p-3 text-[#2A1B12] text-left">
                    <div className="px-1 py-1 border-b border-[#e5d8c3]/30">
                      <p className="text-xs font-semibold text-[#2A1B12]">{user.displayName || "Fragrance Lover"}</p>
                      <p className="text-[10px] text-[#7b6b57] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-1 py-1.5 text-xs font-semibold hover:text-[#B88A3D] transition"
                    >
                      <User size={14} className="text-[#B88A3D]" />
                      My Profile
                    </Link>
                    <Link
                      href="/my-orders"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-1 py-1.5 text-xs font-semibold hover:text-[#B88A3D] transition"
                    >
                      <ShoppingBag size={14} className="text-[#B88A3D]" />
                      My Orders
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                      className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-[#e5d8c3] bg-white py-2 text-xs font-bold transition hover:border-[#B88A3D] w-full"
                    >
                      <LogOut size={13} className="text-red-700" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("");
                      setShowLoginModal(true);
                      setOpen(false);
                    }}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-3
                      rounded-full
                      border
                      border-[#d8cbb4]
                      bg-white
                      px-5
                      py-3
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.14em]
                      text-[#2A1B12]
                      transition
                      duration-300
                      hover:border-[#B88A3D]
                    "
                  >
                    <LoginMark size={15} />
                    Login
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setCartOpen(true);
                  }}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#D4A24C]
                    px-5
                    py-3
                    text-center
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-black
                    transition
                    duration-300
                    hover:bg-[#E0B35A]
                  "
                >
                  <ShoppingBag size={16} />
                  Cart
                  <span className="rounded-full bg-[#5d1717] px-2 py-0.5 text-[0.62rem] text-white">
                    {cartCount}
                  </span>
                </button>
              </div>
            </div>
          )}
      </div>

      {cartOpen && (
          <div className="fixed inset-0 z-[120] animate-[why-aan-reveal_0.16s_ease-out_both]">
            <button
              type="button"
              aria-label="Close cart"
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            <aside
              className="fixed bottom-3 right-3 top-3 flex h-[calc(100dvh-1.5rem)] max-h-[calc(100dvh-1.5rem)] w-[calc(100vw-3rem)] max-w-[320px] flex-col overflow-hidden rounded-l-[10px] rounded-r-[4px] bg-[#f7f8fb] text-[#16100c] shadow-[-20px_0_70px_rgba(0,0,0,0.24)] sm:bottom-0 sm:right-0 sm:top-0 sm:h-[100dvh] sm:max-h-[100dvh] sm:w-[320px] sm:rounded-none lg:w-[350px] lg:max-w-[350px]"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
            >
              <div className="shrink-0 border-b border-black/10 bg-[#f7f8fb] px-3.5 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#2A1B12]">
                    Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                  <button
                    type="button"
                    aria-label="Close cart"
                    onClick={() => setCartOpen(false)}
                    className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-black/5"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div 
                data-lenis-prevent
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain cart-scrollbar px-3 py-2.5 sm:px-3.5 sm:py-3"
              >
                {cartItems.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-black/10 bg-white">
                        <ShoppingBag size={22} />
                      </div>
                      <div className="mt-4 font-sans text-xs font-semibold text-[#2A1B12]">
                        Your cart is empty
                      </div>
                      <Link
                        href="/build-your-signature"
                        onClick={() => setCartOpen(false)}
                        className="mt-5 inline-flex h-11 items-center rounded-full bg-[#D4A24C] px-5 font-sans text-[10px] font-bold text-black transition hover:bg-[#E0B35A]"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartDrawerItems.map((item) => (
                      <div
                        key={`${item.id}-${item.variant || "default"}-${item.volume || "volume"}`}
                        className="space-y-3"
                      >
                        <div className="rounded-[8px] border border-black/10 bg-white p-2 shadow-sm sm:p-2.5">
                          <div className="grid grid-cols-[64px_1fr_auto] gap-2 sm:grid-cols-[72px_1fr_auto] sm:gap-2.5">
                            <Link
                              href={item.slug ? `/product/${item.slug}` : "/build-your-signature"}
                              onClick={() => setCartOpen(false)}
                              className="relative h-[68px] w-[64px] overflow-hidden rounded-[8px] bg-[#120b08] sm:h-[76px] sm:w-[72px]"
                            >
                              <Image
                                src={item.image || "/attar-bottle.svg"}
                                alt={item.name}
                                fill
                                sizes="(max-width: 639px) 64px, 72px"
                                decoding="async"
                                className="object-cover"
                              />
                            </Link>

                            <div className="min-w-0">
                              <span className="line-clamp-2 font-sans text-[11px] font-semibold leading-tight text-[#2A1B12] block">
                                {item.name}
                              </span>
                              {item.variant && (
                                <div className="mt-0.5 truncate font-sans text-[10px] text-[#6e6257]">
                                  {item.variant}
                                </div>
                              )}
                              {item.volume && (
                                <div className="mt-0.5 truncate font-sans text-[10px] text-[#6e6257]">
                                  Volume: {item.volume.replace("ml", " ml")}
                                </div>
                              )}
                              <div className="mt-1 font-sans text-[11px] font-bold text-[#8a5f1f]">
                                {formatPrice(item.price)}
                              </div>

                              <div className="mt-1.5 inline-flex h-7 items-center overflow-hidden rounded-[8px] border border-black/10 bg-[#f7f8fb] sm:mt-2 sm:h-8">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.id,
                                      item.quantity - 1,
                                      item.variant,
                                      item.volume
                                    )
                                  }
                                  className="grid h-7 w-7 place-items-center transition hover:bg-black/5 sm:h-8 sm:w-8"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="grid h-7 min-w-7 place-items-center border-x border-black/10 font-sans text-[10px] font-semibold sm:h-8 sm:min-w-8">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    updateCartQuantity(
                                      item.id,
                                      item.quantity + 1,
                                      item.variant,
                                      item.volume
                                    )
                                  }
                                  className="grid h-7 w-7 place-items-center transition hover:bg-black/5 sm:h-8 sm:w-8"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() => removeCartItem(item.id, item.variant, item.volume)}
                              className="grid h-8 w-8 place-items-center rounded-full text-[#371515] transition hover:bg-[#5d1717]/10"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                    {hasSalimBaseInCart && (
                      <SalimComboBuilder onChooseMore={() => setCartOpen(false)} />
                    )}
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-black/10 bg-white px-3.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] sm:px-4 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pt-3">
                <div className="mb-2.5 space-y-1.5 sm:mb-3">
                  {salimComboState.active ? (
                    <>
                      <div className="rounded-[6px] border border-emerald-600/20 bg-emerald-50 p-2 font-sans text-[10px]">
                        <p className="font-bold text-emerald-800">
                          Salim Combo Offer Applied
                        </p>
                        <p className="mt-0.5 text-[9px] font-semibold text-emerald-700">
                          You saved {formatPrice(salimComboState.savedAmount)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between font-sans text-[10px] text-[#5f554b]">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartSubtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between font-sans text-[10px] font-semibold text-emerald-700">
                        <span>Combo Discount</span>
                        <span>-{formatPrice(salimComboState.discount)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 font-sans text-xs font-bold text-[#2A1B12]">
                        <span>Final Total</span>
                        <span>{formatPrice(salimComboState.finalTotal)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[10px] font-semibold text-[#5f554b]">Estimated Total</span>
                      <span className="font-sans text-xs font-bold text-[#2A1B12]">
                        {formatPrice(cartSubtotal)}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="flex h-10 w-full items-center justify-center rounded-[8px] bg-[#c0943e] font-sans text-[10px] font-bold uppercase tracking-[0.06em] text-black transition hover:bg-[#d2a64d] sm:h-11"
                >
                  View Cart
                </Link>
              </div>
            </aside>
          </div>
        )}

      {/* Premium Login Modal for Mobile/Universal */}
      {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              onClick={() => {
                setShowLoginModal(false);
                setAuthError("");
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[why-aan-reveal_0.16s_ease-out_both]"
            />

            <div
              className="relative w-full max-w-md overflow-hidden rounded-[16px] border border-[#e5d8c3] bg-[#fffaf3] p-6 text-[#2A1B12] shadow-2xl animate-[why-aan-reveal_0.22s_ease-out_both]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setAuthError("");
                }}
                className="absolute right-4 top-4 text-[#8a7862] hover:text-[#5d1717]"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-[#2A1B12] font-display">
                    {browserInfo.isMetaInAppBrowser ? "Open in your browser" : "Welcome to Aan Attar"}
                  </h3>
                  <p className="mt-1 text-sm text-[#7b6b57]">
                    {browserInfo.isMetaInAppBrowser
                      ? "For the best sign-in experience, please open this page in Chrome or Safari."
                      : "Sign in for a premium experience"}
                  </p>
                </div>

                {browserInfo.isMetaInAppBrowser && (
                  <>
                    <button
                      type="button"
                      onClick={openInSystemBrowser}
                      className="
                        flex
                        h-11
                        w-full
                        items-center
                        justify-center
                        rounded-[8px]
                        bg-[#5d1717]
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-[#742020]
                        active:scale-[0.98]
                      "
                    >
                      Open in Browser
                    </button>
                    <p className="text-center text-xs leading-relaxed text-[#7b6b57]">
                      If the button does not open a browser, use the Instagram or Facebook menu and choose Open in browser.
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={browserInfo.isMetaInAppBrowser ? handleGoogleRedirectLogin : handleGoogleLogin}
                  disabled={authLoading}
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-[8px]
                    border
                    border-[#d8cbb4]
                    bg-white
                    text-sm
                    font-semibold
                    text-[#2A1B12]
                    transition
                    hover:border-[#B88A3D]
                    hover:bg-[#fff7e9]
                    active:scale-[0.98]
                    disabled:opacity-50
                  "
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.04 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.19c-.268 1.419-1.07 2.619-2.277 3.428l3.523 2.732c2.06-1.9 3.24-4.7 3.24-8.287Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.266 14.235A7.108 7.108 0 0 1 4.909 12c0-.79.13-1.554.357-2.265L1.24 6.62A11.96 11.96 0 0 0 0 12c0 1.92.454 3.736 1.24 5.35l4.026-3.115Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.96-1.073 7.945-2.909l-3.523-2.732c-.977.655-2.227 1.05-3.664 1.05-2.822 0-5.218-1.905-6.068-4.473L.664 18.05A11.97 11.97 0 0 0 12 24Z"
                    />
                  </svg>
                  {browserInfo.isMetaInAppBrowser ? "Continue Here" : "Google Account"}
                </button>

                {authError && (
                  <p className="text-xs font-medium text-red-600 text-center">
                    {authError}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#fffaf3]/95 backdrop-blur-md border-t border-[#e5d8c3]/40 shadow-[0_-4px_16px_rgba(42,27,18,0.06)] px-2 py-1.5 md:hidden">
        <div className="flex justify-around items-center h-12">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 text-[9px] font-bold uppercase tracking-[0.08em] transition duration-300 ${
              pathname === "/" ? "text-[#B88A3D]" : "text-[#5d1717]"
            }`}
          >
            <Home size={18} className={pathname === "/" ? "text-[#B88A3D]" : "text-[#5d1717]"} />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex flex-col items-center justify-center flex-1 gap-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#5d1717] hover:text-[#B88A3D] transition duration-300 animate-none"
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#5d1717] px-1 text-[7px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </button>

          <Link
            href="/build-your-signature"
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 text-[9px] font-bold uppercase tracking-[0.08em] transition duration-300 ${
              pathname === "/build-your-signature" ? "text-[#B88A3D]" : "text-[#5d1717]"
            }`}
          >
            <Sparkles
              size={18}
              className={pathname === "/build-your-signature" ? "text-[#B88A3D]" : "text-[#5d1717]"}
            />
            <span>Signature</span>
          </Link>

          <Link
            href="/my-orders"
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 text-[9px] font-bold uppercase tracking-[0.08em] transition duration-300 ${
              pathname === "/my-orders" ? "text-[#B88A3D]" : "text-[#5d1717]"
            }`}
          >
            <Heart size={18} className={pathname === "/my-orders" ? "text-[#B88A3D]" : "text-[#5d1717]"} />
            <span>Orders</span>
          </Link>

          <Link
            href={user ? "/profile" : "#"}
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                setShowLoginModal(true);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 gap-0.5 text-[9px] font-bold uppercase tracking-[0.08em] transition duration-300 ${
              pathname === "/profile" ? "text-[#B88A3D]" : "text-[#5d1717]"
            }`}
          >
            <User size={18} className={pathname === "/profile" ? "text-[#B88A3D]" : "text-[#5d1717]"} />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
