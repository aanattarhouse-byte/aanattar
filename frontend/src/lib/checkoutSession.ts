import type { CartItem } from "@/lib/cart";

export const CHECKOUT_SESSION_KEY = "aanstory_checkout_session";

export type CheckoutAddress = {
  receiverName: string;
  mobile: string;
  alternateMobile: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  deliveryInstructions: string;
};

export type CheckoutSession = CheckoutAddress & {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  finalAmount: number;
  localOrderId?: string;
  razorpayOrderId?: string;
};

export function saveCheckoutSession(session: CheckoutSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify(session));
}

export function getCheckoutSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(CHECKOUT_SESSION_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as CheckoutSession;
  } catch {
    return null;
  }
}

export function clearCheckoutSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CHECKOUT_SESSION_KEY);
}

export function getShippingAddress(session: CheckoutSession) {
  return {
    fullName: session.receiverName,
    phone: session.mobile,
    alternatePhone: session.alternateMobile,
    line1: session.house,
    line2: session.street,
    landmark: session.landmark,
    city: session.city,
    state: session.state,
    pincode: session.pincode,
    country: session.country || "India",
    deliveryInstructions: session.deliveryInstructions,
    receiverFullName: session.receiverName,
    mobileNumber: session.mobile,
    alternateMobileNumber: session.alternateMobile,
    houseFlatBuilding: session.house,
    streetAreaLocality: session.street,
  };
}

export function getOrderProducts(session: CheckoutSession) {
  return session.cartItems.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    image: item.image,
    variant: item.variant,
    size: item.variant,
    quantity: item.quantity,
    price: item.price,
  }));
}
