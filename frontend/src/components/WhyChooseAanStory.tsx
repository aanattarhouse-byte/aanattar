"use client";

import { fadeUp, stagger } from "@/lib/framer/motion";
import { motion } from "framer-motion";
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
          <motion.span
            key={particle}
            className={`absolute rounded-full bg-[#ffcf7a] shadow-[0_0_18px_rgba(255,207,122,0.9)] ${particle}`}
            animate={{ y: [-8, 12, -8], opacity: [0.35, 0.9, 0.35] }}
            transition={{ duration: 4 + index * 0.35, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            id="why-customers-love"
            variants={fadeUp}
            className="relative z-20 font-display text-3xl font-semibold leading-tight text-white drop-shadow-[0_8px_34px_rgba(255,179,71,0.18)] sm:text-4xl lg:text-5xl"
          >
            Why Customers Love Salim
          </motion.h2>
        </div>

        <motion.div
          variants={fadeUp}
          className="relative -mx-4 mt-3 max-w-6xl overflow-visible md:mx-auto md:mt-6 md:overflow-hidden"
        >
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
              priority
              className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/8 to-transparent" />
          </Link>
          <ShopSalimButton
            className="absolute bottom-4 left-[45px] z-20 flex h-[40px] w-[68px] items-center justify-center overflow-hidden rounded-[20px] border-2 border-[#ffff] text-center text-[9px] font-bold uppercase tracking-[0.08em] text-[#ffff] shadow-[0_4px_12px_rgba(0,0,0,0.3)] md:h-[42px] md:w-[130px] md:rounded-[14px] md:text-[12px] md:tracking-[0.1em]"
          >
            <span className="relative">  Shop Salim &gt;&gt; </span>
          </ShopSalimButton>
        </motion.div>

      </motion.div>
    </section>
  );
}
