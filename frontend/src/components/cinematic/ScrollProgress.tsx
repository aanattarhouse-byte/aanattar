"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-px w-full origin-left bg-gradient-to-r from-[#ff6b35] via-[#ffb347] to-[#c89b3c]"
      style={{ scaleX }}
    />
  );
}
