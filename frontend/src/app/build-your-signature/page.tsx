
import SignatureProductExplorer from "@/components/SignatureProductExplorer";
import Testimonials from "@/components/Testimonials";
import { signatureProducts } from "@/lib/products";

export const metadata = {
  title: "Build Your Signature | Aan Attar Hosue",
  description: "Explore 35 luxury attars and choose the scent that becomes your signature.",
};

export default function BuildYourSignaturePage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="relative isolate overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(184,138,61,0.22),transparent_34%),linear-gradient(110deg,#050505_0%,#11100e_55%,#0b0b0b_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t from-[#0b0b0b] to-transparent" />

        <SignatureProductExplorer products={signatureProducts} />
      </section>
      <Testimonials />
    </main>
  );
}
