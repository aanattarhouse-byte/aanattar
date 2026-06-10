"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
FaInstagram,
FaFacebookF,
FaEnvelope,
FaPhoneAlt
} from "react-icons/fa";

export default function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="
        relative
        overflow-hidden
        text-white
        pt-20
        pb-8
        bg-[url('/footer.jpg')]
        bg-cover
        bg-center
      "
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 z-0" />

      {/* Luxury top curve */}
      <div className="absolute top-0 left-0 w-full z-10">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-[60px]"
        >
          <path
            fill="#fff"
            d="M0,80 C280,20 500,20 720,60 C940,100 1180,100 1440,60 L1440,0 L0,0 Z"
          />
        </svg>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-8 lg:px-12 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-6 border-b border-white/5">
          {/* Brand Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <h2 className="mb-1 whitespace-nowrap text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
              Aan Attar
            </h2>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Premium attar and fragrance stories crafted with olfactive artistry.
            </p>

            {/* Premium Social & Contact info */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-2">
                <a
                  href="#"
                  className="
                    w-8 h-8 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    hover:bg-amber-400
                    hover:text-black
                    hover:scale-105
                    duration-300
                  "
                >
                  <FaInstagram size={13} />
                </a>

                <a
                  href="#"
                  className="
                    w-8 h-8 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    hover:bg-amber-400
                    hover:text-black
                    hover:scale-105
                    duration-300
                  "
                >
                  <FaFacebookF size={12} />
                </a>

                <a
                  href="mailto:hello@theaanstory.com"
                  className="
                    w-8 h-8 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    hover:bg-amber-400
                    hover:text-black
                    hover:scale-105
                    duration-300
                  "
                >
                  <FaEnvelope size={12} />
                </a>

                <a
                  href="tel:+9199999888888"
                  className="
                    w-8 h-8 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    hover:bg-amber-400
                    hover:text-black
                    hover:scale-105
                    duration-300
                  "
                >
                  <FaPhoneAlt size={12} />
                </a>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 border-l border-white/10 pl-4">
                <a href="mailto:aan.attarhouse@gmail.com" className="hover:text-zinc-300 transition-colors">
                  aan.attarhouse@gmail.com
                </a>
                <span className="text-zinc-700">|</span>
                <a href="tel:+919876543210" className="hover:text-zinc-300 transition-colors">
                  +91 9876543210
                </a>
              </div>
            </div>
          </motion.div>

          {/* Links - all one line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-400"
          >
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-[10px]">Support</span>
            <span className="text-zinc-600">:</span>
            <Link href="/contact" className="hover:text-amber-300 duration-300 transition-colors">
              Contact
            </Link>

            <span className="text-zinc-700 mx-2">|</span>

            <span className="text-amber-400 font-semibold tracking-wider uppercase text-[10px]">Legal</span>
            <span className="text-zinc-600">:</span>
            <Link href="/privacy" className="hover:text-amber-300 duration-300 transition-colors">
              Privacy
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/terms" className="hover:text-amber-300 duration-300 transition-colors">
              Terms
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/cookies" className="hover:text-amber-300 duration-300 transition-colors">
              Cookies
            </Link>
          </motion.div>
        </div>

        {/* Bottom */}
        <div
          className="
            pt-4
            flex flex-col md:flex-row
            justify-between items-center
            gap-2
            text-[11px]
            text-zinc-500
          "
        >
          <p>(c) {currentYear} Aan Attar. All rights reserved.</p>
          <p className="italic">Crafted with luxury and precision</p>
        </div>
      </div>
    </motion.footer>
  );
}
