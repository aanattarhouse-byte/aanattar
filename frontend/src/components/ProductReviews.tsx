"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    name: "Amaan R.",
    tag: "Verified buyer",
    rating: 5,
    text: "The opening feels premium right away, and the dry down stayed smooth for hours without becoming heavy.",
  },
  {
    name: "Zoya K.",
    tag: "Gift purchase",
    rating: 5,
    text: "The bottle made a beautiful gift. The scent has that expensive attar feeling but still feels wearable.",
  },
  {
    name: "Rehan S.",
    tag: "Daily wear",
    rating: 4,
    text: "Strong enough to notice, clean enough for daily use. Two small swipes were enough for office wear.",
  },
];

export default function ProductReviews({ product }: { product: Product }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-review-heading]", {
        opacity: 0,
        y: 24,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      gsap.from("[data-review-card]", {
        opacity: 0,
        y: 28,
        scale: 0.98,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.to("[data-review-marquee]", {
        xPercent: -50,
        duration: 18,
        ease: "none",
        repeat: -1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-white px-4 py-12 text-[#1f1712] sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div
          data-review-heading
          className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
        >
          <div>
            <span className="inline-flex rounded-full bg-[#2A1B12] px-3 py-1.5 font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#F8DC7B]">
              Trending Reviews
            </span>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
              What customers say about {product.name}
            </h2>
          </div>
          <p className="max-w-2xl text-sm text-[#6e6257] sm:text-base lg:ml-auto">
            Real-style feedback focused on longevity, gifting, projection, and
            the first impression of this premium attar.
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-[8px] border border-[#eadfce] bg-[#fffaf3]">
          <div
            data-review-marquee
            className="flex w-max gap-4 whitespace-nowrap px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#B88A3D]"
          >
            <span>{product.name}</span>
            <span>Long lasting attar</span>
            <span>Premium fragrance oil</span>
            <span>Gift ready scent</span>
            <span>{product.name}</span>
            <span>Long lasting attar</span>
            <span>Premium fragrance oil</span>
            <span>Gift ready scent</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              data-review-card
              className="rounded-[8px] border border-[#eadfce] bg-[#fffaf3] p-5 shadow-[0_18px_45px_rgba(42,27,18,0.08)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-sans text-base font-bold text-[#2A1B12]">
                    {review.name}
                  </p>
                  <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#B88A3D]">
                    {review.tag}
                  </p>
                </div>
                <div className="flex text-[#D4A24C]" aria-label={`${review.rating} star review`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#6e6257]">
                {review.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
