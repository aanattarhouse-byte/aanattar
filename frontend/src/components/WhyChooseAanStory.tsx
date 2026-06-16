"use client";

import { fadeUp, stagger } from "@/lib/framer/motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      aria-labelledby="why-customers-love"
      className="cinematic-section relative isolate overflow-hidden py-20 sm:py-24 lg:py-28"
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
          className="-mx-4 sm:mx-auto mt-8 max-w-6xl overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="relative w-full aspect-video sm:aspect-[16/9] overflow-hidden cursor-pointer group"
          >
            <Image
              src="/hero2.png"
              alt="Salim benefits visual"
              fill
              sizes="(min-width: 1024px) 1152px, 92vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/8 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <div className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                Click to Zoom
              </div>
            </div>
          </button>
        </motion.div>

        {/* Zoom Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close zoom"
            >
              <X size={24} />
            </button>
            <div className="relative w-full max-w-4xl max-h-[90vh] aspect-video sm:aspect-[16/9]">
              <Image
                src="/hero2.png"
                alt="Salim benefits visual - zoomed"
                fill
                sizes="(min-width: 1024px) 1024px, 90vw"
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        <motion.div variants={fadeUp} className="mt-14 flex justify-center">
          <ShopSalimButton
            className="group relative overflow-hidden rounded-full border border-[#fff0bd]/45 bg-gradient-to-r from-[#ff7a38] via-[#ffb347] to-[#c89b3c] px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#090705] shadow-[0_18px_70px_rgba(255,179,71,0.26)] transition duration-300 hover:scale-[1.025] hover:shadow-[0_24px_90px_rgba(255,179,71,0.38)]"
          >
            <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/55 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
            <span className="relative">Shop Salim</span>
          </ShopSalimButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
