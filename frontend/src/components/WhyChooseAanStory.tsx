import Image from "next/image";
import Link from "next/link";

import ShopSalimButton from "@/components/ShopSalimButton";

const particles = [
  "left-[8%] top-[18%] h-1.5 w-1.5 opacity-70",
  "left-[20%] top-[72%] h-1 w-1 opacity-50",
  "left-[36%] top-[28%] h-1 w-1 opacity-60",
  "left-[52%] top-[82%] h-1.5 w-1.5 opacity-55",
  "left-[72%] top-[20%] h-1 w-1 opacity-70",
  "left-[86%] top-[62%] h-1.5 w-1.5 opacity-50",
  "left-[92%] top-[32%] h-1 w-1 opacity-45",
  "left-[14%] top-[46%] h-1 w-1 opacity-60",
];

const salimBadgeButtonClassName =
  "group absolute bottom-[15px] left-[43px] z-20 flex h-[30px] min-w-[86px] items-center justify-center whitespace-nowrap rounded-[4px] border border-[#c9963b] bg-[#0d2a4f] px-2 text-[10px] font-extrabold uppercase leading-none tracking-[0.06em] text-[#f2c766] shadow-[0_5px_12px_rgba(6,18,38,0.3),inset_0_0_0_1px_rgba(255,226,151,0.18),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-[#6e4a1d]/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f1c665] hover:bg-[#123460] hover:text-[#ffe08b] hover:shadow-[0_10px_22px_rgba(6,18,38,0.4),inset_0_0_0_1px_rgba(255,226,151,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] active:translate-y-0 sm:bottom-4 sm:left-[54px] sm:h-7 sm:min-w-[94px] sm:px-3 sm:text-[7px] md:bottom-[146px] md:left-[155px] md:h-11 md:min-w-[146px] md:rounded-[8px] md:px-5 md:text-sm md:tracking-[0.14em] md:shadow-[0_8px_22px_rgba(6,18,38,0.34),inset_0_0_0_1px_rgba(255,226,151,0.22),inset_0_1px_0_rgba(255,255,255,0.16)]";

export default function WhyChooseAanStory() {
  return (
    <section
      aria-labelledby="why-customers-love"
      className="cinematic-section relative isolate overflow-hidden py-5 md:py-12 lg:py-14"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_8%,rgba(255,179,71,0.18),transparent_34rem),radial-gradient(ellipse_at_82%_18%,rgba(255,107,53,0.14),transparent_30rem),linear-gradient(180deg,#070605_0%,#0f0c08_46%,#050505_100%)]" />
      <div className="absolute left-1/2 top-10 -z-10 h-64 w-[min(42rem,80vw)] -translate-x-1/2 rounded-full bg-[#ffb347]/10 blur-3xl" />
      <div className="absolute -bottom-24 left-10 -z-10 h-72 w-72 rounded-full bg-[#9b6b25]/16 blur-3xl" />
      <div className="absolute -right-20 top-32 -z-10 h-80 w-80 rounded-full bg-[#ff6b35]/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <span
            key={particle}
            className={`why-aan-particle absolute rounded-full bg-[#ffcf7a] shadow-[0_0_18px_rgba(255,207,122,0.9)] ${particle}`}
            style={{
              animationDuration: `${4 + index * 0.35}s`,
              animationDelay: `${index * 0.18}s`,
            }}
          />
        ))}
      </div>

      <div className="why-aan-reveal relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="why-customers-love"
            className="relative z-20 font-display text-3xl font-semibold leading-tight text-white drop-shadow-[0_8px_34px_rgba(255,179,71,0.18)] sm:text-4xl lg:text-5xl"
          >
            Why Customers Love Salim
          </h2>
        </div>

        <div className="relative -mx-4 mt-3 max-w-6xl overflow-visible md:mx-auto md:mt-6 md:overflow-hidden">
          <Link
            href="/products/salim-luxury-attar"
            className="group relative block w-full cursor-pointer overflow-hidden"
            aria-label="Shop Salim Luxury Attar"
          >
            <Image
              src="/hero2.png"
              alt="Salim benefits visual"
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
              quality={82}
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 3rem), 1152px"
              className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/8 to-transparent" />
          </Link>
          <ShopSalimButton className={salimBadgeButtonClassName}>
            <span className="relative">Shop Now</span>
          </ShopSalimButton>
        </div>

      </div>
    </section>
  );
}
