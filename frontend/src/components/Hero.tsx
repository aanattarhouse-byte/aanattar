"use client";

import Image from "next/image";
import Link from "next/link";

const heroSlides = [
  {
    desktopSrc: "/desktop1.jpg",
    mobileSrc: "/mobile1.jpeg",
    alt: "Luxury Perfume Banner 1",
    linkClassName:
      "left-[64%] top-[72%] sm:left-[66%] sm:top-[70%] md:left-[63%] md:top-[73%]",
    linkColorClassName:
      "text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] hover:text-white",
  },
  {
    desktopSrc: "/desktop2.jpg",
    mobileSrc: "/mobile2.jpeg",
    alt: "Luxury Perfume Banner 2",
    linkClassName:
      "left-[57%] top-[64%] sm:left-[56%] sm:top-[62%] md:left-[59%] md:top-[71%]",
    linkColorClassName: "text-[#2A1B12]/85 hover:text-[#2A1B12]",
  },
  {
    desktopSrc: "/desktop3.jpg",
    mobileSrc: "/mobile3.jpeg",
    alt: "Luxury Perfume Banner 3",
    linkClassName:
      "left-[9%] top-[47%] sm:left-[10%] sm:top-[46%] md:left-[19%] md:top-[70%]",
    linkColorClassName: "text-[#2A1B12]/85 hover:text-[#2A1B12]",
  },
];

export default function Hero() {
  const scrollingImages = [...heroSlides, heroSlides[0]];

  return (
    <section className="relative w-full overflow-hidden bg-black md:h-[75vh] lg:h-[calc(100vh-82px)] lg:max-h-screen">
      <div className="hero-scroll-track flex md:h-full">
        {scrollingImages.map((image, index) => (
          <div
            key={`${image.desktopSrc}-${image.mobileSrc}-${index}`}
            className="relative h-[560px] w-full shrink-0 sm:h-[640px] md:h-full"
          >
            <Image
              src={image.desktopSrc}
              alt={image.alt}
              width={1820}
              height={1000}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={100}
              sizes="100vw"
              className="hidden h-full w-full object-cover object-center md:block"
            />
            <Image
              src={image.mobileSrc}
              alt={image.alt}
              width={780}
              height={1500}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={100}
              sizes="100vw"
              className="h-full w-full object-cover object-center md:hidden"
            />
            <Link
              href="/products/salim-luxury-attar"
              className={`absolute z-10 mt-4 inline-block cursor-pointer bg-transparent text-[16px] font-semibold transition duration-300 ease-in-out hover:translate-x-1 sm:text-[17px] md:mt-5 md:text-[18px] ${image.linkColorClassName} ${image.linkClassName}`}
            >
              Shop Salim &gt;&gt;
            </Link>
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
