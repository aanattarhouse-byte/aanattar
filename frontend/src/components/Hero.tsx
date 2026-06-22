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
    <section className="relative w-full overflow-hidden bg-black md:h-[75vh] lg:h-[calc(100vh-82px)] lg:max-h-screen">
      <div className="hero-scroll-track flex md:h-full">
        {scrollingImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="relative w-full shrink-0 md:h-full"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={1820}
              height={1000}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={100}
              sizes="100vw"
              className="h-auto w-full md:h-full md:object-cover md:object-center"
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
