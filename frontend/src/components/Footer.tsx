"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
  FaPhoneAlt,
  FaCreditCard
} from "react-icons/fa";
import { SiGooglepay, SiPhonepe, SiRazorpay, SiVisa } from "react-icons/si";
import { MapPin, Phone as PhoneIcon, Mail as MailIcon } from "lucide-react";
import ParticleField from "@/components/particles/ParticleField";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const paymentMethods = [
    {
      label: "Google Pay",
      icon: SiGooglepay,
      className: "bg-white text-[#5f6368]",
      iconClassName: "text-[#4285F4]",
    },
    {
      label: "PhonePe",
      icon: SiPhonepe,
      className: "bg-[#5F259F] text-white",
      iconClassName: "text-white",
    },
    {
      label: "Visa",
      icon: SiVisa,
      className: "bg-white text-[#1A1F71]",
      iconClassName: "text-[#1A1F71]",
    },
    {
      label: "Debit Card",
      icon: FaCreditCard,
      className: "bg-[#F58220] text-white",
      iconClassName: "text-white",
    },
    {
      label: "Razorpay",
      icon: SiRazorpay,
      className: "bg-[#0B72E7] text-white",
      iconClassName: "text-white",
    },
  ];

  return (
    <div className="bg-white w-full">
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="
          relative
          overflow-hidden
          text-white
          pt-16
          pb-8
          bg-[#060713]
          rounded-t-[40px]
          md:rounded-t-[75px]
          lg:rounded-t-[90px]
          border-t
          border-white/5
        "
      >
        {/* Dynamic moving stars/particles inside footer background */}
        <ParticleField isAbsolute className="opacity-45" />

        {/* Subtle dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060713] via-[#060713]/90 to-[#060713]/75 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
            {/* Column 1: Brand / Logo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-tight text-white uppercase sm:text-2xl">
                  Aan Attar
                </span>
                <span className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.25em] text-[#B88A3D]">
                  Premium Fragrance House
                </span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                Premium attar and fragrance stories crafted with olfactive artistry. Discover a signature scent that lingers with timeless elegance.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2.5 mt-2">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="
                    w-9 h-9 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    text-zinc-400
                    hover:bg-[#B88A3D]
                    hover:text-black
                    hover:border-[#B88A3D]
                    hover:scale-105
                    duration-300
                    transition
                  "
                >
                  <FaInstagram size={14} />
                </a>

                <a
                  href="#"
                  aria-label="Facebook"
                  className="
                    w-9 h-9 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    text-zinc-400
                    hover:bg-[#B88A3D]
                    hover:text-black
                    hover:border-[#B88A3D]
                    hover:scale-105
                    duration-300
                    transition
                  "
                >
                  <FaFacebookF size={13} />
                </a>

                <a
                  href="mailto:hello@theaanstory.com"
                  aria-label="Email support"
                  className="
                    w-9 h-9 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    text-zinc-400
                    hover:bg-[#B88A3D]
                    hover:text-black
                    hover:border-[#B88A3D]
                    hover:scale-105
                    duration-300
                    transition
                  "
                >
                  <FaEnvelope size={13} />
                </a>

                <a
                  href="tel:+919876543210"
                  aria-label="Phone hotline"
                  className="
                    w-9 h-9 rounded-full
                    border border-white/10
                    bg-white/5 backdrop-blur-xl
                    flex items-center justify-center
                    text-zinc-400
                    hover:bg-[#B88A3D]
                    hover:text-black
                    hover:border-[#B88A3D]
                    hover:scale-105
                    duration-300
                    transition
                  "
                >
                  <FaPhoneAlt size={13} />
                </a>
              </div>
            </motion.div>



            {/* Column 3: Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-[#B88A3D] font-bold tracking-widest uppercase text-[11px]">
                Quick Links
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-zinc-400">
                <li>
                  <Link href="/about" className="hover:text-amber-300 transition duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/build-your-signature" className="hover:text-amber-300 transition duration-300">
                    Build Your Signature
                  </Link>
                </li>
                <li>
                  <Link href="/build-your-wardrobe" className="hover:text-amber-300 transition duration-300">
                    Build Your Wardrobe
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-amber-300 transition duration-300">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="hover:text-amber-300 transition duration-300">
                    Track Order
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Column 4: Customer Support */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              <h3 className="text-[#B88A3D] font-bold tracking-widest uppercase text-[11px]">
                Customer Support
              </h3>
              <ul className="flex flex-col gap-3 text-xs text-zinc-400">
                <li className="flex items-start gap-3">
                  <MapPin size={15} className="text-[#B88A3D] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Aan Attar House, 3RD, 103C, Ustad Enayet Khan Avenue , 700017, Kolkata, India.
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneIcon size={15} className="text-[#B88A3D] shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-zinc-200 transition">
                    +91 9876543210
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MailIcon size={15} className="text-[#B88A3D] shrink-0" />
                  <a href="mailto:hello@theaanstory.com" className="hover:text-zinc-200 transition">
                    hello@theaanstory.com
                  </a>
                </li>

              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar: Copyright & Payment Methods */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <p>© {currentYear} Aan Attar. All rights reserved.</p>
              <span className="hidden sm:inline text-zinc-700">|</span>
              <div className="flex gap-2">
                <Link href="/privacy" className="hover:text-zinc-400 transition">
                  Privacy Policy
                </Link>
                <span className="text-zinc-800">•</span>
                <Link href="/terms" className="hover:text-zinc-400 transition">
                  Terms & Conditions
                </Link>
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-500 mr-1.5 uppercase font-medium tracking-wider">Payment Methods:</span>
              {paymentMethods.map(({ label, icon: Icon, className, iconClassName }) => (
                <span
                  key={label}
                  aria-label={label}
                  title={label}
                  className={`${className} inline-flex h-6 min-w-10 items-center justify-center rounded-[4px] border border-white/10 px-2 shadow-sm select-none`}
                >
                  <Icon aria-hidden="true" className={`${iconClassName} h-3.5 w-auto`} />
                  <span className="sr-only">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
