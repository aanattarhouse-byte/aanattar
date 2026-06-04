"use client";

import { useState, useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import {
  saveCheckoutSession,
  type CheckoutSession,
} from "@/lib/checkoutSession";

type CheckoutAddressForm = {
  receiverFullName: string;
  mobileNumber: string;
  alternateMobileNumber: string;
  houseFlatBuilding: string;
  streetAreaLocality: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  deliveryInstructions: string;
};

type CheckoutAddressModalProps = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  finalAmount: number;
  onClose: () => void;
  initialSession?: CheckoutSession | null;
};

const initialForm: CheckoutAddressForm = {
  receiverFullName: "",
  mobileNumber: "",
  alternateMobileNumber: "",
  houseFlatBuilding: "",
  streetAreaLocality: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  deliveryInstructions: "",
};

const requiredFields: Array<keyof CheckoutAddressForm> = [
  "receiverFullName",
  "mobileNumber",
  "houseFlatBuilding",
  "streetAreaLocality",
  "city",
  "state",
  "pincode",
];

const fieldLabels: Record<keyof CheckoutAddressForm, string> = {
  receiverFullName: "Receiver full name",
  mobileNumber: "Mobile number",
  alternateMobileNumber: "Alternate mobile number",
  houseFlatBuilding: "House / flat / building no",
  streetAreaLocality: "Street / area / locality",
  landmark: "Landmark",
  city: "City",
  state: "State",
  pincode: "Pincode",
  country: "Country",
  deliveryInstructions: "Delivery instructions",
};

function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

function validateForm(form: CheckoutAddressForm) {
  const nextErrors: Partial<Record<keyof CheckoutAddressForm, string>> = {};

  for (const field of requiredFields) {
    if (!form[field].trim()) {
      nextErrors[field] = `${fieldLabels[field]} is required.`;
    }
  }

  const mobile = normalizePhone(form.mobileNumber);
  if (form.mobileNumber.trim() && !/^(\+91)?[6-9]\d{9}$/.test(mobile)) {
    nextErrors.mobileNumber = "Enter a valid Indian mobile number.";
  }

  const alternateMobile = normalizePhone(form.alternateMobileNumber);
  if (
    form.alternateMobileNumber.trim() &&
    !/^(\+91)?[6-9]\d{9}$/.test(alternateMobile)
  ) {
    nextErrors.alternateMobileNumber = "Enter a valid alternate mobile number.";
  }

  if (form.pincode.trim() && !/^\d{6}$/.test(form.pincode.trim())) {
    nextErrors.pincode = "Enter a valid 6 digit pincode.";
  }

  return nextErrors;
}

function Field({
  label,
  name,
  form,
  errors,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  name: keyof CheckoutAddressForm;
  form: CheckoutAddressForm;
  errors: Partial<Record<keyof CheckoutAddressForm, string>>;
  onChange: (name: keyof CheckoutAddressForm, value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-sans font-semibold tracking-wide text-zinc-300">
        {label} {required && <span className="text-amber-300">*</span>}
      </span>
      <input
        type={type}
        value={form[name]}
        onChange={(event) => onChange(name, event.target.value)}
        className="mt-1 h-9 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-[11px] text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/60"
      />
      {errors[name] && (
        <span className="mt-0.5 block text-[10px] font-sans font-medium text-red-300">
          {errors[name]}
        </span>
      )}
    </label>
  );
}

export default function CheckoutAddressModal({
  items,
  subtotal,
  discount,
  finalAmount,
  onClose,
  initialSession,
}: CheckoutAddressModalProps) {
  const router = useRouter();
  const [form, setForm] = useState<CheckoutAddressForm>(
    initialSession
      ? {
          receiverFullName: initialSession.receiverName,
          mobileNumber: initialSession.mobile,
          alternateMobileNumber: initialSession.alternateMobile,
          houseFlatBuilding: initialSession.house,
          streetAreaLocality: initialSession.street,
          landmark: initialSession.landmark,
          city: initialSession.city,
          state: initialSession.state,
          pincode: initialSession.pincode,
          country: initialSession.country || "India",
          deliveryInstructions: initialSession.deliveryInstructions,
        }
      : initialForm
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutAddressForm, string>>>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Disable background scrolling
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // Stop Lenis smooth scroll if active
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }

    return () => {
      document.body.style.overflow = originalStyle;

      // Re-enable Lenis smooth scroll
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, []);

  const updateField = (name: keyof CheckoutAddressForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const saveAddressAndContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      saveCheckoutSession({
        receiverName: form.receiverFullName.trim(),
        mobile: normalizePhone(form.mobileNumber),
        alternateMobile: normalizePhone(form.alternateMobileNumber),
        house: form.houseFlatBuilding.trim(),
        street: form.streetAreaLocality.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: form.country.trim() || "India",
        cartItems: items,
        subtotal,
        discount,
        finalAmount,
        deliveryInstructions: form.deliveryInstructions.trim(),
      });
      router.push("/checkout/payment");
    } catch (error) {
      setStatusMessage(
          error instanceof Error
            ? error.message
            : "Could not save the address. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 sm:p-4">
      <div className="flex max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] w-full max-w-md flex-col overflow-hidden rounded-[12px] border border-white/10 bg-[#120d0a] text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
          <div>
            <span className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-amber-300">
              Checkout
            </span>
            <div className="mt-0.5 text-base font-sans font-bold text-white">
              Delivery Information
            </div>
            <div className="mt-0.5 text-[11px] font-sans text-zinc-400">
              Add your address before payment. Total: <span className="font-bold text-amber-200">{formatPrice(finalAmount)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="grid h-8 w-8 place-items-center rounded-full text-zinc-200 transition hover:bg-white/10"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={saveAddressAndContinue} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-3.5 sm:px-5">
            <section>
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-amber-200">
                Receiver Details
              </h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Receiver Full Name" name="receiverFullName" form={form} errors={errors} onChange={updateField} required />
                </div>
                <Field label="Mobile Number" name="mobileNumber" form={form} errors={errors} onChange={updateField} required />
                <Field label="Alternate Mobile Number" name="alternateMobileNumber" form={form} errors={errors} onChange={updateField} />
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-amber-200">
                Delivery Address
              </h4>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="House / Flat / Building No" name="houseFlatBuilding" form={form} errors={errors} onChange={updateField} required />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Street / Area / Locality" name="streetAreaLocality" form={form} errors={errors} onChange={updateField} required />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Landmark" name="landmark" form={form} errors={errors} onChange={updateField} />
                </div>
                <Field label="City" name="city" form={form} errors={errors} onChange={updateField} required />
                <Field label="State" name="state" form={form} errors={errors} onChange={updateField} required />
                <Field label="Pincode" name="pincode" form={form} errors={errors} onChange={updateField} required />
                <Field label="Country" name="country" form={form} errors={errors} onChange={updateField} required />
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-amber-200">
                Order Notes
              </h4>
              <div className="mt-2">
                <label className="block">
                  <span className="text-[10px] font-sans font-semibold tracking-wide text-zinc-300">
                    Delivery Instructions
                  </span>
                  <textarea
                    value={form.deliveryInstructions}
                    onChange={(event) => updateField("deliveryInstructions", event.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/60"
                  />
                </label>
              </div>
            </section>

            {statusMessage && (
              <div className="rounded-[6px] border border-white/10 bg-white/[0.06] p-3 text-xs font-sans text-zinc-100">
                {statusMessage}
              </div>
            )}
          </div>

          <div className="flex shrink-0 gap-3 border-t border-white/10 bg-[#120d0a] px-4 py-3 justify-end sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-[6px] border border-white/15 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 rounded-[6px] bg-[#D4A24C] px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#E0B35A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving Address..." : "Continue To Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
