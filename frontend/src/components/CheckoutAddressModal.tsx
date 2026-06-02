"use client";

import { useState, type FormEvent } from "react";
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
      <span className="text-[11px] font-semibold text-zinc-300">
        {label} {required && <span className="text-amber-300">*</span>}
      </span>
      <input
        type={type}
        value={form[name]}
        onChange={(event) => onChange(name, event.target.value)}
        className="mt-1.5 h-10 w-full rounded-[8px] border border-white/10 bg-white/[0.06] px-3 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/60"
      />
      {errors[name] && (
        <span className="mt-1 block text-[11px] font-medium text-red-300">
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

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-4 sm:px-4">
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[12px] border border-white/10 bg-[#120d0a] text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
              Checkout
            </p>
            <h2 className="mt-1 text-lg font-semibold sm:text-xl">Delivery Information</h2>
            <p className="mt-1 text-xs text-zinc-300">
              Add your address before payment. Total: {formatPrice(finalAmount)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="grid h-9 w-9 place-items-center rounded-full text-zinc-200 transition hover:bg-white/10"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={saveAddressAndContinue} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
              Receiver Details
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Receiver Full Name" name="receiverFullName" form={form} errors={errors} onChange={updateField} required />
              <Field label="Mobile Number" name="mobileNumber" form={form} errors={errors} onChange={updateField} required />
              <Field label="Alternate Mobile Number" name="alternateMobileNumber" form={form} errors={errors} onChange={updateField} />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
              Delivery Address
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="House / Flat / Building No" name="houseFlatBuilding" form={form} errors={errors} onChange={updateField} required />
              <Field label="Street / Area / Locality" name="streetAreaLocality" form={form} errors={errors} onChange={updateField} required />
              <Field label="Landmark" name="landmark" form={form} errors={errors} onChange={updateField} />
              <Field label="City" name="city" form={form} errors={errors} onChange={updateField} required />
              <Field label="State" name="state" form={form} errors={errors} onChange={updateField} required />
              <Field label="Pincode" name="pincode" form={form} errors={errors} onChange={updateField} required />
              <Field label="Country" name="country" form={form} errors={errors} onChange={updateField} required />
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
              Order Notes
            </h3>
            <label className="mt-3 block">
              <span className="text-[11px] font-semibold text-zinc-300">
                Delivery Instructions
              </span>
              <textarea
                value={form.deliveryInstructions}
                onChange={(event) => updateField("deliveryInstructions", event.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/60"
              />
            </label>
          </section>

          {statusMessage && (
            <p className="rounded-[8px] border border-white/10 bg-white/[0.06] p-3 text-xs text-zinc-100">
              {statusMessage}
            </p>
          )}
          </div>

          <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-[#120d0a] px-4 py-3 sm:flex-row sm:justify-end sm:px-5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-[8px] border border-white/15 px-5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-[8px] bg-[#D4A24C] px-5 text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#E0B35A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving Address..." : "Continue To Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
