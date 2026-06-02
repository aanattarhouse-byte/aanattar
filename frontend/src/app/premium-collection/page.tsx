import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";
import { premiumProducts } from "@/lib/products";

export const metadata = {
  title: "Premium Collection | Salim Luxury Attar",
  description: "Featured premium attars for statement moments, refined evenings, and royal occasions.",
};

export default function PremiumCollectionPage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <ScrollReveal>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300">
                Premium Collection
              </p>
              <h1 className="mt-4 text-5xl leading-none md:text-7xl">
                Reserved for memorable entrances.
              </h1>
            </ScrollReveal>
            <ScrollReveal
              delay={0.12}
              className="max-w-2xl text-lg text-zinc-300 lg:ml-auto"
            >
              A tighter edit of the richest, most magnetic blends in the house:
              oudh reserves, noir signatures, elite inspirations, and royal
              mukhallats built for lasting presence.
            </ScrollReveal>
          </div>

          <div className="mt-12">
            <ProductGrid products={premiumProducts} />
          </div>
        </div>
      </section>
    </main>
  );
}
