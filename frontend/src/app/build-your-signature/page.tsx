import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";
import Testimonials from "@/components/Testimonials";
import { signatureProducts } from "@/lib/products";

export const metadata = {
  title: "Build Your Signature | Salim Luxury Attar",
  description: "Explore 35 luxury attars and choose the scent that becomes your signature.",
};

export default function BuildYourSignaturePage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              Build Your Signature
            </p>
            <h1 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">
              Choose the attar that enters before you do.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-zinc-300 md:text-base">
              Explore the full Salim Luxury Attar collection, from royal oudh
              blends to clean musks, botanical florals, and modern elite
              inspirations.
            </p>
            <Link
              href="/build-your-wardrobe"
              className="mt-6 inline-flex h-10 items-center rounded-[8px] border border-amber-300/40 bg-white/5 px-5 text-xs font-bold uppercase tracking-[0.1em] text-amber-100 transition hover:bg-amber-300 hover:text-black"
            >
              Build Your Wardrobe
            </Link>
          </ScrollReveal>

          <div className="mt-9">
            <ProductGrid products={signatureProducts} compact />
          </div>
        </div>
      </section>
      <Testimonials />
    </main>
  );
}
