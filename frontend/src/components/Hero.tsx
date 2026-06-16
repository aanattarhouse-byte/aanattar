"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
  const heroImages = [
    { src: "/hero1.png", alt: "Luxury Perfume Banner 1" },
    { src: "/hero3.jpeg", alt: "Luxury Perfume Banner 3" },
    { src: "/hero4.jpeg", alt: "Luxury Perfume Banner 4" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative w-full overflow-hidden bg-[#eee6d9]">
      <Image
        src={heroImages[currentImageIndex].src}
        alt={heroImages[currentImageIndex].alt}
        width={6000}
        height={2813}
        priority
        sizes="100vw"
        className="w-full h-auto"
      />
    </section>
  );
}
