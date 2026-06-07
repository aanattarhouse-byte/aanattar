import Image from "next/image";
import { notFound, redirect } from "next/navigation";
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
  searchParams?: Promise<{
    collection?: string;
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

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isPremium = resolvedSearchParams?.collection === "premium";

  if (slug === "salim" || slug === "salim-luxury-attar") {
    redirect("/products/salim-luxury-attar");
  }

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <ProductDetailActions product={product} isPremium={isPremium} />
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
