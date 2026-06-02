import CartClient from "@/components/CartClient";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata = {
  title: "Cart | Salim Luxury Attar",
  description: "Review your selected luxury attars and adjust quantities.",
};

export default function CartPage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300">
              Cart
            </p>
            <h1 className="mt-4 text-5xl leading-none md:text-7xl">
              Your selected attars.
            </h1>
          </ScrollReveal>
          <CartClient />
        </div>
      </section>
    </main>
  );
}
