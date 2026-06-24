import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import GalaxyParticleField from "@/components/particles/GalaxyParticleField";

export const metadata: Metadata = {
  title: "Contact Aan Attar | Premium Attar Support",
  description:
    "Contact Aan Attar for premium attar recommendations, gifting help, order support, fragrance guidance, and custom signature scent questions.",
  alternates: {
    canonical: "https://theaanstory.com/contact",
  },
};

const contactOptions = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@theaanstory.com",
    href: "mailto:hello@theaanstory.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9876543210",
    href: "tel:+919876543210",
  },
  {
    icon: MessageCircle,
    label: "Fragrance Help",
    value: "Ask for scent suggestions",
    href: "/build-your-signature",
  },
];

const quickTopics = [
  "Choose a signature attar",
  "Find a gifting fragrance",
  "Ask about oudh and musk",
  "Order and delivery support",
];

export default function ContactPage() {
  return (
    <main className="bg-[#0b0b0b] md:bg-[#f8f3ea] text-white md:text-[#2A1B12]">
      <section className="relative isolate overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
        {/* Swirling 3D WebGL Galaxy Background */}
        <GalaxyParticleField className="absolute inset-0 -z-10 h-full w-full md:hidden" />
        
        {/* Bottom vignette/fade mask */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b0b0b] to-transparent pointer-events-none -z-10 md:hidden" />

        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end relative z-10">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300 md:text-[#B88A3D]">
              Contact Aan Attar
            </p>
            <h1 className="mt-4 text-4xl leading-none sm:text-5xl md:text-6xl lg:text-7xl text-white md:text-[#2A1B12] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] md:drop-shadow-none">
              Need help choosing the right attar?
            </h1>
          </ScrollReveal>

          <ScrollReveal
            delay={0.12}
            className="max-w-2xl text-base text-zinc-300 sm:text-lg lg:ml-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:drop-shadow-none md:text-[#6e6257]"
          >
            Tell us the mood, occasion, or person you are shopping for. We will
            help you find a long-lasting attar, premium oudh, musk, floral oil,
            or signature scent that fits.
          </ScrollReveal>
        </div>
      </section>

      <section className="border-y border-white/10 md:border-[#eadfce]/60 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {contactOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                key={option.label}
                href={option.href}
                className="group rounded-[8px] border border-white/10 bg-[#15100d]/90 p-5 transition hover:-translate-y-1 hover:border-amber-300/35 hover:bg-[#1d1510] md:border-[#eadfce] md:bg-[#fffaf3] md:hover:border-amber-300/35 md:hover:bg-[#fff7e9]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] text-black">
                  <Icon size={19} />
                </span>
                <p className="mt-5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-amber-200 md:text-[#B88A3D]">
                  {option.label}
                </p>
                <p className="mt-2 text-base text-zinc-200 md:text-[#2A1B12]">{option.value}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <ScrollReveal>
            <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-amber-200 md:border-[#B88A3D]/20 md:bg-[#B88A3D]/5 md:text-[#B88A3D]">
              Trending Requests
            </span>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl text-white md:text-[#2A1B12]">
              Fast help for fragrance decisions.
            </h2>
          </ScrollReveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-4 md:border-[#eadfce] md:bg-[#fffaf3]"
              >
                <Sparkles size={17} className="shrink-0 text-amber-300 md:text-[#B88A3D]" />
                <p className="font-sans text-sm font-semibold text-zinc-100 md:text-[#2A1B12]">
                  {topic}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-[#1f1712] sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <ScrollReveal className="rounded-[8px] border border-[#eadfce] bg-[#fffaf3] p-6 shadow-[0_20px_60px_rgba(42,27,18,0.08)] sm:p-8">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#B88A3D]">
              Contact Form
            </p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
              Send your fragrance request.
            </h2>
            <p className="mt-3 text-sm text-[#6e6257] sm:text-base">
              Share your preferred notes, budget, and occasion. We will help you
              choose a fitting attar.
            </p>

            <Link
              href="/build-your-signature"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-[8px] border border-[#d8c7aa] bg-white px-5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#2A1B12] transition hover:border-[#B88A3D] hover:bg-[#fff7e9]"
            >
              Browse First
            </Link>
          </ScrollReveal>

          <form className="grid gap-4 rounded-[8px] border border-[#eadfce] bg-[#fffaf3] p-5 shadow-[0_20px_60px_rgba(42,27,18,0.08)] sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#7b5b2d]">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="h-12 rounded-[8px] border border-[#dfd1bb] bg-white px-4 text-sm font-medium normal-case tracking-normal text-[#2A1B12] outline-none transition placeholder:text-[#9b8c78] focus:border-[#B88A3D]"
                />
              </label>

              <label className="grid gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#7b5b2d]">
                Phone or Email
                <input
                  type="text"
                  name="contact"
                  placeholder="+91 or email"
                  className="h-12 rounded-[8px] border border-[#dfd1bb] bg-white px-4 text-sm font-medium normal-case tracking-normal text-[#2A1B12] outline-none transition placeholder:text-[#9b8c78] focus:border-[#B88A3D]"
                />
              </label>
            </div>

            <label className="grid gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#7b5b2d]">
              Interest
              <select
                name="interest"
                className="h-12 rounded-[8px] border border-[#dfd1bb] bg-white px-4 text-sm font-medium normal-case tracking-normal text-[#2A1B12] outline-none transition focus:border-[#B88A3D]"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a topic
                </option>
                <option>Signature attar recommendation</option>
                <option>Oudh or musk guidance</option>
                <option>Gift suggestion</option>
                <option>Order support</option>
              </select>
            </label>

            <label className="grid gap-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#7b5b2d]">
              Message
              <textarea
                name="message"
                rows={5}
                placeholder="Tell us the occasion, scent mood, or product name..."
                className="resize-none rounded-[8px] border border-[#dfd1bb] bg-white px-4 py-3 text-sm font-medium normal-case leading-6 tracking-normal text-[#2A1B12] outline-none transition placeholder:text-[#9b8c78] focus:border-[#B88A3D]"
              />
            </label>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] px-6 font-sans text-xs font-bold uppercase tracking-[0.14em] text-black shadow-[0_14px_32px_rgba(184,120,47,0.2)] transition hover:brightness-105 sm:w-fit"
            >
              <Send size={15} />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
