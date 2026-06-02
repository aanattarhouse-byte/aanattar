"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    title: "The Compliment Trigger",
    name: "Arjun Sharma",
    role: "Delhi - Verified Buyer",
    quote:
      "Wore this to the office last week. Literally three strangers stopped me to ask what I was wearing. Mind blown.",
  },
  {
    title: "The Longevity Proof",
    name: "Rahul Verma",
    role: "Mumbai - Athlete",
    quote:
      "Finally an attar that easily survives a 2-hour intense football match and a heavy gym session. The lasting power is crazy.",
  },
  {
    title: "The Value & Blind-Buy Justification",
    name: "Rohan Das",
    role: "Kolkata - Fragrance Enthusiast",
    quote:
      "Smells exactly like a Rs. 6,000 designer perfume I own. For Rs. 499 including shipping, this is an absolute steal.",
  },
  {
    title: "The Ultimate Risk-Killer",
    name: "Kabir Mehta",
    role: "Bengaluru - Daily Wearer",
    quote:
      "Was skeptical about buying a perfume online, but the performance is elite. Zero irritation on skin, pure luxury.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-8 md:py-16">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:rounded-[28px]">
          <div className="grid items-center lg:min-h-[430px] lg:grid-cols-[0.95fr_1.05fr]">
            <div className="px-5 py-7 md:px-12 md:py-10">
              <span className="mb-6 inline-flex items-center rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
                Trusted Clients
              </span>

              <h2 className="mb-4 text-xl font-semibold leading-[1.12] tracking-tight text-zinc-900 sm:text-2xl md:mb-5 md:text-4xl">
                Timeless fragrances
                <br />
                loved by those
                <br />
                who wear them
              </h2>

              <p className="mb-6 max-w-lg text-sm leading-relaxed text-zinc-600 md:mb-7 md:text-base">
                Crafted perfumes inspired by elegance and luxury. Our customers
                choose scents that leave a signature, not just an impression.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/salim"
                  className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Shop Salim
                </Link>
              </div>
            </div>

            <div className="relative p-3 pb-5 md:p-7 lg:p-9">
              <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 sm:grid-cols-2 md:rounded-3xl">
                {testimonials.map((item, i) => (
                  <div
                    key={item.name}
                    className={`min-h-[160px] border-zinc-200 p-4 transition-all duration-700 sm:min-h-[175px] sm:p-4 md:p-5 ${
                      i % 2 === 0 ? "sm:border-r" : ""
                    } ${i < 3 ? "border-b" : ""} ${
                      i === 2 ? "sm:border-b-0" : ""
                    } ${
                      active === i
                        ? "scale-[1.02] bg-black text-white"
                        : "bg-white text-zinc-900"
                    }`}
                  >
                    <Quote
                      className={`mb-4 ${
                        active === i ? "text-amber-300" : "text-zinc-400"
                      }`}
                      size={24}
                    />

                    <h3
                      className={`mb-2.5 !text-lg font-semibold leading-snug tracking-tight md:!text-xl ${
                        active === i ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`mb-4 text-[11px] leading-relaxed md:text-xs ${
                        active === i ? "text-zinc-200" : "text-zinc-600"
                      }`}
                    >
                      {item.quote}
                    </p>

                    <div className="mb-2.5 flex gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={11}
                          fill="currentColor"
                          className={
                            active === i ? "text-amber-300" : "text-zinc-400"
                          }
                        />
                      ))}
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold">{item.name}</h4>
                      <p
                        className={
                          active === i
                            ? "text-[11px] text-zinc-300"
                            : "text-[11px] text-zinc-500"
                        }
                      >
                        {item.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute -top-6 right-10 h-20 w-20 rounded-full bg-zinc-100 blur-2xl" />
              <div className="absolute bottom-8 left-8 h-24 w-24 rounded-full bg-zinc-100 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
