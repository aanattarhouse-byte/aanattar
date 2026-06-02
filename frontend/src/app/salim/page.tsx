import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { salimProducts } from "@/lib/products";

const salimProduct = salimProducts[0];

export const metadata = {
  title: "Shop Salim | Salim Luxury Attar",
  description:
    "Shop the Salim Luxury Attar individual collection page with signature attars, premium oudh blends, clean musks, florals, and long-lasting perfume oils.",
};

export default function SalimPage() {
  return (
    <main className="overflow-hidden bg-white text-zinc-950">
      <section className="relative isolate px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="salim-white-aura absolute inset-0 -z-10" />
        <div className="absolute left-[8%] top-12 -z-10 h-28 w-28 rounded-full border border-amber-200/70" />
        <div className="absolute bottom-16 right-[12%] -z-10 h-36 w-36 rounded-full border border-zinc-200" />

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <ScrollReveal className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
              Salim Product
            </p>
            <h1 className="mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Salim Luxury Attar, the signature 12 ML product.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
              A focused shopping page for the Salim Luxury Attar: concentrated,
              premium, gift-ready, and made for Indian weather with long-lasting
              wear.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#salim-picks"
                className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-zinc-950 px-5 text-sm font-bold text-white shadow-[0_16px_36px_rgba(24,24,27,0.18)] transition hover:bg-amber-600"
              >
                Shop Now
                <ArrowRight size={17} strokeWidth={2.3} />
              </Link>
              <Link
                href="/build-your-signature"
                className="inline-flex h-11 items-center rounded-[8px] border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-950 shadow-sm transition hover:border-amber-400 hover:text-amber-700"
              >
                Full Collection
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal
            delay={0.12}
            className="relative min-h-[360px] rounded-[8px] border border-zinc-200 bg-white p-5 shadow-[0_28px_90px_rgba(24,24,27,0.11)]"
          >
            <div className="salim-logo-orbit absolute inset-5 rounded-[8px] border border-amber-200/80" />
            <div className="salim-logo-float relative mx-auto grid aspect-square max-w-[430px] place-items-center overflow-hidden rounded-[8px] bg-zinc-950">
              <Image
                src="/salim2.jpg"
                alt="Aan Story gold logo"
                fill
                priority
                sizes="(min-width: 1024px) 430px, 85vw"
                className="object-cover"
              />
              <div className="salim-logo-shine absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.2),transparent_32%),linear-gradient(115deg,transparent_32%,rgba(255,255,255,0.28)_45%,transparent_58%)]" />
            </div>
            <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Sparkles, label: "Signature scent" },
                { icon: BadgeCheck, label: "Premium oils" },
                { icon: Truck, label: "Ready to gift" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex min-h-16 items-center gap-3 rounded-[8px] border border-zinc-200 bg-zinc-50 px-3 text-sm font-bold text-zinc-800"
                >
                  <item.icon className="shrink-0 text-amber-700" size={19} />
                  {item.label}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="salim-picks" className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_420px] lg:items-start">
          <div>
            <ScrollReveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
                Salim Luxury Attar
              </p>
              <h2 className="mt-3 text-3xl leading-tight text-zinc-950 sm:text-4xl">
                The signature Salim product for this page.
              </h2>
            </ScrollReveal>
            <ScrollReveal
              delay={0.1}
              className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 md:text-base"
            >
              This page keeps the shopping experience direct: one Salim Luxury
              Attar product, one clear choice, and quick access to view details
              or add it to cart.
            </ScrollReveal>
          </div>

          <div className="w-full max-w-[420px] justify-self-center lg:justify-self-end">
            <ProductCard product={salimProduct} />
          </div>
        </div>
      </section>
    </main>
  );
}
