"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CinematicLoading() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(false), 1650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#060606]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(18px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 cinematic-gradient-field opacity-80" />
          <div className="cinematic-smoke opacity-60" />
          <motion.div
            className="relative text-center"
            initial={{ opacity: 0, y: 24, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9 }}
          >
            <p className="mb-5 text-xs uppercase tracking-[0.5em] text-[#ffb347]/80">Salim Luxury Attar</p>
            <h2 className="font-display text-4xl text-white md:text-6xl">A Signature Opens</h2>
            <motion.div className="mx-auto mt-8 h-px w-64 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff6b35] via-[#ffb347] to-[#c89b3c]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
