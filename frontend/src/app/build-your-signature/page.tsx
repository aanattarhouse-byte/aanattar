
import AnimatedSignatureHeader from "@/components/AnimatedSignatureHeader";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import NebulaParticleField from "@/components/particles/NebulaParticleField";
import { signatureProducts } from "@/lib/products";

const BUILDER_PRODUCT_PRICE = 1;

export const metadata = {
  title: "Build Your Signature | Aan Attar Hosue",
  description: "Explore 35 luxury attars and choose the scent that becomes your signature.",
};

export default function BuildYourSignaturePage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Breathing 3D WebGL Cosmic Nebula Background */}
        <NebulaParticleField className="absolute inset-0 -z-10 h-full w-full" />

        {/* Bottom vignette/fade mask */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b0b0b] to-transparent pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl relative z-10">
          <AnimatedSignatureHeader />

          <div className="mt-9">
            <ProductGrid
              products={signatureProducts}
              compact
              priceOverride={BUILDER_PRODUCT_PRICE}
            />
          </div>
        </div>
      </section>
      <Testimonials />
    </main>
  );
}
