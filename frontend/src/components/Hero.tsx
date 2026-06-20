"use client";

import Image from "next/image";

const heroImages = [
  { src: "/hero5.jpeg", alt: "Luxury Perfume Banner 1" },
  { src: "/hero6.jpeg", alt: "Luxury Perfume Banner 3" },
  { src: "/hero7.jpeg", alt: "Luxury Perfume Banner 4" },
];

export default function Hero() {
  const scrollingImages = [...heroImages, heroImages[0]];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="hero-scroll-track flex">
        {scrollingImages.map((image, index) => (
          <div key={`${image.src}-${index}`} className="relative w-full shrink-0">
            <Image
              src={image.src}
              alt={image.alt}
              width={1820}
              height={1000}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={100}
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .hero-scroll-track {
          animation: hero-scroll-right-to-left 12s infinite ease-in-out;
        }

        @keyframes hero-scroll-right-to-left {
          0%,
          27% {
            transform: translateX(0%);
          }
          33%,
          60% {
            transform: translateX(-100%);
          }
          66%,
          93% {
            transform: translateX(-200%);
          }
          100% {
            transform: translateX(-300%);
          }
        }
      `}</style>
    </section>
  );
}
