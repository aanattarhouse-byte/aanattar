"use client";

import {
  LogOut,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { CART_OPEN_EVENT } from "@/lib/cart";
import { products, signatureProducts } from "@/lib/products";
import { useAuth } from "@/context/AuthContext";
import SalimComboBuilder from "@/components/SalimComboBuilder";
import {
  getSalimComboState,
  isSalimComboBaseItem,
  isSalimComboMiniItem,
  salimComboConfig,
} from "@/lib/salimCombo";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Premium Collection", href: "/premium-collection" },
  { label: "Build Your Signature", href: "/build-your-signature" },
];

const signatureProductSlugs = new Set(
  signatureProducts.map((product) => product.slug)
);

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 260,
    damping: 18,
  });

  const springY = useSpring(y, {
    stiffness: 260,
    damping: 18,
  });

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);

        y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        data-active={active ? "true" : "false"}
        className={className}
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loginWithGoogle, logout } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const {
    items: cartItems,
    count: cartCount,
    subtotal: cartSubtotal,
    addItem: addCartItem,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
  } = useCart();
  const salimComboState = getSalimComboState(cartItems);
  const hasSignatureProductInCart = cartItems.some(
    (item) => item.slug && signatureProductSlugs.has(item.slug)
  );
  const hasSalimBaseInCart = cartItems.some(isSalimComboBaseItem);
  const salimComboMiniItems = hasSalimBaseInCart
    ? cartItems.filter(isSalimComboMiniItem)
    : [];
  const missingSalimComboAddOns = hasSalimBaseInCart
    ? salimComboConfig.addOns.filter(
        (addOn) => !salimComboMiniItems.some((item) => item.id === addOn.id)
      )
    : [];
  const cartDrawerItems = hasSalimBaseInCart
    ? cartItems.filter((item) => !isSalimComboMiniItem(item))
    : cartItems;

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return products.slice(0, 5);
    }

    return products
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
  }, [searchQuery]);

  // Session persistent synchronization is managed by AuthProvider now.

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



  const handleGoogleLogin = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await loginWithGoogle();
      setLoginOpen(false);
      setShowLoginModal(false);
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
      <motion.div
        className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8"
        animate={{
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <nav className="flex h-[78px] items-center justify-between gap-3 sm:h-[82px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-3 xl:flex-none"
            onClick={() => setOpen(false)}
          >
            <span className="relative h-12 w-22 shrink-0 overflow-hidden">
              <Image
                src="/logo1.png"
                alt="Aan Attar logo"
                fill
                sizes="98px"
                priority
                className="object-cover"
              />
            </span>

            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-display text-[1.05rem] font-semibold text-[#2A1B12] sm:text-[1.32rem]">
                Aan Attar
              </span>

              <span className="mt-1 truncate text-[0.5rem] font-bold uppercase tracking-[0.22em] text-[#B88A3D] sm:text-[0.58rem] sm:tracking-[0.34em]">
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
              <motion.button
                type="button"
                aria-label="Search products"
                onClick={() => {
                  setSearchOpen((value) => !value);
                  setLoginOpen(false);
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
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
                      {searchResults.length > 0 ? (
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

             <div ref={loginRef} className="relative">
              <motion.button
                type="button"
                aria-label={user ? "Open account menu" : "Login"}
                onClick={() => {
                  setLoginOpen((value) => !value);
                  setAuthError("");
                }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
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
              </motion.button>
 
              <AnimatePresence>
                {loginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
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
              "
            >
              <ShoppingCart size={21} />
              <span className="absolute right-0 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#5d1717] px-1 text-[0.62rem] font-bold leading-none text-white">
                {cartCount}
              </span>
            </motion.button>
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                mb-4
                overflow-hidden
                rounded-[24px]
                border
                border-[#e5d8c3]
                bg-white
                p-3
                shadow-lg
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
                    {searchResults.length > 0 ? (
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
                <button
                  type="button"
                  onClick={() => {
                    if (user) {
                      handleLogout();
                    } else {
                      setAuthError("");
                      setShowLoginModal(true);
                    }

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
                  {user ? <User size={16} /> : <LoginMark size={15} />}
                  {user ? "Account" : "Login"}
                </button>

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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed inset-0 z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close cart"
              onClick={() => setCartOpen(false)}
              className="absolute inset-0 bg-black/45"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="absolute right-0 top-0 flex h-dvh w-full max-w-[400px] flex-col bg-[#f7f8fb] text-[#16100c] shadow-[-20px_0_70px_rgba(0,0,0,0.24)]"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
            >
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                <h2 className="text-lg font-semibold">
                  Your Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                </h2>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={() => setCartOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                {cartItems.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-black/10 bg-white">
                        <ShoppingBag size={22} />
                      </div>
                      <p className="mt-4 font-display text-2xl">
                        Your cart is empty
                      </p>
                      <Link
                        href="/build-your-signature"
                        onClick={() => setCartOpen(false)}
                        className="mt-5 inline-flex h-11 items-center rounded-full bg-[#D4A24C] px-5 text-sm font-bold text-black transition hover:bg-[#E0B35A]"
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
                        <div className="rounded-[8px] border border-black/10 bg-white p-3 shadow-sm">
                          <div className="grid grid-cols-[84px_1fr_auto] gap-3">
                            <Link
                              href={item.slug ? `/product/${item.slug}` : "/build-your-signature"}
                              onClick={() => setCartOpen(false)}
                              className="relative h-[86px] overflow-hidden rounded-[8px] bg-[#120b08]"
                            >
                              <Image
                                src={item.image || "/attar-bottle.svg"}
                                alt={item.name}
                                fill
                                sizes="84px"
                                className="object-cover"
                              />
                            </Link>

                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-medium leading-snug">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <p className="mt-1 truncate text-xs text-[#6e6257]">
                                  {item.variant}
                                </p>
                              )}
                              {item.volume && (
                                <p className="mt-1 truncate text-xs text-[#6e6257]">
                                  Volume: {item.volume.replace("ml", " ml")}
                                </p>
                              )}
                              <p className="mt-2 text-sm font-semibold">
                                {formatPrice(item.price)}
                              </p>

                              <div className="mt-3 inline-flex h-9 items-center overflow-hidden rounded-[8px] border border-black/10 bg-[#f7f8fb]">
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
                                  className="grid h-9 w-9 place-items-center transition hover:bg-black/5"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="grid h-9 min-w-9 place-items-center border-x border-black/10 text-sm font-semibold">
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
                                  className="grid h-9 w-9 place-items-center transition hover:bg-black/5"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() => removeCartItem(item.id, item.variant, item.volume)}
                              className="grid h-9 w-9 place-items-center rounded-full text-[#371515] transition hover:bg-[#5d1717]/10"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {isSalimComboBaseItem(item) &&
                            (salimComboMiniItems.length > 0 ||
                              missingSalimComboAddOns.length > 0) && (
                            <div className="mt-3 border-t border-black/10 pt-3">
                              <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
                                Combo products
                              </p>
                              <div className="mt-2 space-y-2">
                                {salimComboMiniItems.map((miniItem) => (
                                  <div
                                    key={`${miniItem.id}-${miniItem.variant || "default"}-${miniItem.volume || "volume"}`}
                                    className="grid grid-cols-[44px_1fr_auto] items-center gap-2 rounded-[8px] border border-emerald-700/15 bg-emerald-50 p-2"
                                  >
                                    <Image
                                      src={miniItem.image || "/attar-bottle.svg"}
                                      alt={miniItem.name}
                                      width={44}
                                      height={44}
                                      className="h-11 w-11 rounded-[6px] object-cover"
                                    />
                                    <div className="min-w-0">
                                      <p className="truncate text-xs font-bold text-[#16100c]">
                                        {miniItem.name}
                                      </p>
                                      <p className="mt-0.5 text-[11px] font-semibold text-[#5f554b]">
                                        Qty {miniItem.quantity} x {formatPrice(miniItem.price)}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      aria-label={`Remove ${miniItem.name}`}
                                      onClick={() =>
                                        removeCartItem(
                                          miniItem.id,
                                          miniItem.variant,
                                          miniItem.volume
                                        )
                                      }
                                      className="grid h-8 w-8 place-items-center rounded-full text-[#371515] transition hover:bg-[#5d1717]/10"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                                {missingSalimComboAddOns.map((addOn) => (
                                  <button
                                    key={addOn.id}
                                    type="button"
                                    onClick={() =>
                                      addCartItem({
                                        id: addOn.id,
                                        name: addOn.name,
                                        image: addOn.image,
                                        price: addOn.price,
                                        quantity: item.quantity,
                                        variant: "Salim Combo",
                                        volume: addOn.size.toLowerCase(),
                                      })
                                    }
                                    className="flex w-full items-center justify-between rounded-[8px] border border-dashed border-emerald-700/30 bg-white px-3 py-2 text-left text-xs font-bold text-emerald-800 transition hover:bg-emerald-50"
                                  >
                                    <span>Add {addOn.name}</span>
                                    <Plus size={14} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {hasSignatureProductInCart && <SalimComboBuilder />}
                  </div>
                )}
              </div>

              <div className="border-t border-black/10 bg-white px-5 py-4">
                <div className="mb-4 space-y-2">
                  {salimComboState.active ? (
                    <>
                      <div className="rounded-[8px] border border-emerald-600/20 bg-emerald-50 p-3 text-sm">
                        <p className="font-bold text-emerald-800">
                          Salim Combo Offer Applied
                        </p>
                        <p className="mt-1 text-xs font-semibold text-emerald-700">
                          You saved {formatPrice(salimComboState.savedAmount)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-[#5f554b]">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartSubtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-semibold text-emerald-700">
                        <span>Combo Discount</span>
                        <span>-{formatPrice(salimComboState.discount)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 text-base font-bold">
                        <span>Final Total</span>
                        <span>{formatPrice(salimComboState.finalTotal)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Estimated Total</span>
                      <span className="text-lg font-bold">
                        {formatPrice(cartSubtotal)}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  aria-disabled={cartItems.length === 0}
                  className={`flex h-14 w-full items-center justify-center rounded-[8px] bg-[#c0943e] text-base font-bold uppercase tracking-[0.04em] text-black transition hover:bg-[#d2a64d] ${
                    cartItems.length === 0 ? "pointer-events-none opacity-45" : ""
                  }`}
                >
                  View Cart
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Login Modal for Mobile/Universal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowLoginModal(false);
                setAuthError("");
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md overflow-hidden rounded-[16px] border border-[#e5d8c3] bg-[#fffaf3] p-6 text-[#2A1B12] shadow-2xl"
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
                    Welcome to Aan Attar
                  </h3>
                  <p className="mt-1 text-sm text-[#7b6b57]">
                    Sign in for a premium experience
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
                  Google Account
                </button>

                {authError && (
                  <p className="text-xs font-medium text-red-600 text-center">
                    {authError}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
