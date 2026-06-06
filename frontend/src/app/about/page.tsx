import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

const siteUrl = "https://theaanstory.com";
const pageDescription =
  "Learn about Aan Attar, a premium attar and oudh fragrance house offering long-lasting alcohol-free perfume oils, musks, florals, and signature scent blends.";

const faqs = [
  {
    question: "What is Aan Attar?",
    answer:
      "Aan Attar is a premium fragrance house focused on long-lasting attars, oudh blends, musks, floral oils, and modern inspired perfume oils crafted for Indian weather and everyday luxury.",
  },
  {
    question: "Are attars different from regular perfumes?",
    answer:
      "Yes. Attars are concentrated perfume oils, usually worn directly on pulse points. They are alcohol-free, travel friendly, and designed to stay close to the skin while creating a lasting scent trail.",
  },
  {
    question: "How do I choose the best attar for me?",
    answer:
      "Choose fresh musk or aquatic blends for daily wear, oudh and amber blends for formal occasions, floral attars for gifting, and spicy woody scents when you want a stronger evening signature.",
  },
  {
    question: "How long does Aan Attar last?",
    answer:
      "Longevity depends on skin type, weather, and the fragrance family. Oudh, amber, musk, and resin-rich attars usually last longer, while fresh citrus and aquatic styles feel lighter.",
  },
  {
    question: "Can I gift attar?",
    answer:
      "Yes. Attar is a thoughtful fragrance gift because it feels personal, premium, and easy to carry. For gifting, soft musk, rose, sandalwood, and balanced oudh blends are popular choices.",
  },
];

const values = [
  "Alcohol-free perfume oils with strong character",
  "Curated blends for daily wear, gifting, weddings, and evenings",
  "Oudh, musk, rose, sandalwood, amber, citrus, and floral profiles",
  "Premium fragrance experience at accessible prices",
];

export const metadata: Metadata = {
  title: "About Aan Attar | Premium Attar & Oudh Fragrance House",
  description: pageDescription,
  keywords: [
    "about Aan Attar",
    "premium attar brand",
    "luxury attar India",
    "oudh attar",
    "alcohol free perfume oil",
    "long lasting attar",
    "musk attar",
    "fragrance house",
  ],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Aan Attar",
    description:
      "A premium fragrance house for long-lasting attars, oudh blends, musks, florals, and signature perfume oils.",
    url: `${siteUrl}/about`,
    siteName: "Aan Attar",
    type: "website",
  },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Aan Attar",
        url: siteUrl,
        description:
          "Premium attar and fragrance house for alcohol-free perfume oils, oudh, musk, florals, and signature scent blends.",
        email: "hello@theaanstory.com",
      },
      {
        "@type": "AboutPage",
        name: "About Aan Attar",
        url: `${siteUrl}/about`,
        description: pageDescription,
        isPartOf: {
          "@type": "WebSite",
          name: "Aan Attar",
          url: siteUrl,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="bg-[#0b0b0b] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300 sm:text-sm sm:tracking-[0.24em]">
              About Aan Attar
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl leading-none sm:text-5xl md:text-6xl lg:text-7xl">
              A premium attar house built around memory, mood, and presence.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.12} className="max-w-2xl lg:ml-auto">
            <p className="text-base text-zinc-300 sm:text-lg">
              Aan Attar creates concentrated perfume oils for people
              who want their fragrance to feel personal, refined, and
              unforgettable. Our collection brings together traditional attar
              craft, modern inspired blends, premium oudh, soft musk, florals,
              and everyday signature scents.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/build-your-wardrobe"
                className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#D4A24C] px-5 text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:bg-[#E0B35A]"
              >
                Build Your Wardrobe
              </Link>
              <Link
                href="/build-your-signature"
                className="inline-flex h-11 items-center justify-center rounded-[8px] border border-amber-300/25 bg-white/[0.04] px-5 text-xs font-bold uppercase tracking-[0.12em] text-amber-100 transition hover:border-amber-300/45 hover:bg-white/[0.08]"
              >
                Build Your Signature
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#120d0a] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          {values.map((value) => (
            <div
              key={value}
              className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="font-sans text-sm font-semibold leading-relaxed text-zinc-100">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              Our Story
            </p>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
              Fragrance that feels close, lasting, and unmistakably yours.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.12} className="space-y-5 text-zinc-300">
            <p className="text-base sm:text-lg">
              Every attar begins with a simple belief: scent should say
              something before words do. Some blends are clean and polished for
              the office, some are deep and smoky for night, and some are soft
              enough to become part of a daily ritual.
            </p>
            <p className="text-base sm:text-lg">
              Our range is designed for real wardrobes and real occasions:
              fresh musks for hot days, rose and mogra for gifting, sandalwood
              for calm focus, and oudh-rich blends for weddings, celebrations,
              and statement evenings.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="overflow-hidden bg-white px-4 py-10 text-[#1f1712] sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <ScrollReveal>
              <span className="inline-flex rounded-full bg-[#2A1B12] px-3 py-1.5 font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#F8DC7B]">
                FAQ
              </span>
              <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
                Frequently asked questions
              </h2>
            </ScrollReveal>
            <ScrollReveal
              delay={0.12}
              className="max-w-xl text-sm text-[#6e6257] sm:text-base lg:ml-auto"
            >
              Find quick answers about choosing, wearing, gifting, and caring
              for premium alcohol-free attar.
            </ScrollReveal>
          </div>

          <div className="mt-6 grid gap-2.5">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group overflow-hidden rounded-[8px] border border-[#eadfce] bg-[#fffaf3] shadow-[0_18px_45px_rgba(42,27,18,0.08)] transition hover:-translate-y-0.5 hover:border-[#D4A24C]"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 p-3.5 marker:hidden sm:p-4 [&::-webkit-details-marker]:hidden">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#B8782F] via-[#F8DC7B] to-[#D8A642] font-sans text-[0.68rem] font-bold text-black">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 font-sans text-sm font-bold leading-snug text-[#2A1B12] sm:text-base">
                    {faq.question}
                  </span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d9c7aa] bg-white font-sans text-lg leading-none text-[#5d1717] transition group-open:rotate-45 group-open:border-[#D4A24C] group-open:bg-[#2A1B12] group-open:text-[#F8DC7B]">
                    +
                  </span>
                </summary>
                <div className="border-t border-[#eadfce] px-3.5 pb-4 pt-3 sm:px-4">
                  <p className="max-w-3xl text-sm leading-relaxed text-[#6e6257]">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
