import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailActions from "@/components/ProductDetailActions";
import ProductGrid from "@/components/ProductGrid";
import ProductReviews from "@/components/ProductReviews";
import ScrollReveal from "@/components/ScrollReveal";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Salim Luxury Attar",
    };
  }

  return {
    title: `${product.name} | Salim Luxury Attar`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-7 sm:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#120b08] shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-sm sm:tracking-[0.24em]">
              {product.category}
            </p>
            <h1 className="mt-3 text-4xl leading-none sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base text-zinc-300 sm:mt-6 sm:text-lg">
              {product.description}
            </p>

            <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-amber-200 sm:text-sm sm:tracking-[0.18em]">
                  Vibe
                </p>
                <p className="mt-2 text-sm text-zinc-200 sm:mt-3 sm:text-base">
                  {product.vibe}
                </p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-amber-200 sm:text-sm sm:tracking-[0.18em]">
                  Best For
                </p>
                <p className="mt-2 text-sm text-zinc-200 sm:mt-3 sm:text-base">
                  {product.bestFor}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-4 sm:mt-6 sm:p-5">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-amber-200 sm:text-sm sm:tracking-[0.18em]">
                Fragrance Notes
              </p>
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                {product.notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-xs text-amber-100 sm:px-3 sm:text-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <ProductDetailActions product={product} />
          </ScrollReveal>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <ScrollReveal>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300">
                Related Products
              </p>
              <h2 className="mt-3 text-4xl">More scents in the story</h2>
            </ScrollReveal>
          </div>
          <ProductGrid products={relatedProducts} />
        </div>
      </section>

      <ProductReviews product={product} />
    </main>
  );
}
