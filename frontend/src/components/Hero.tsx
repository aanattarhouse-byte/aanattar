import Image from "next/image";
import Link from "next/link";

const heroSlides = [
  {
    desktopSrc: "/desktop1.jpg",
    mobileSrc: "/mobile1.jpeg",
    alt: "Luxury Perfume Banner 1",
    href: "/products/salim-luxury-attar",
    linkClassName:
      "left-[72%] top-[62%] sm:left-[286%] sm:top-[60%] md:left-[58%] md:top-[73%]",
  },
  {
    desktopSrc: "/desktop2.webp",
    mobileSrc: "/mobile2.jpeg",
    alt: "Luxury Perfume Banner 2",
    href: "/build-your-signature",
    isImageButtonLink: true,
    linkClassName:
      "hidden md:block md:left-[69%] md:top-[87%] md:h-[8%] md:w-[18%]",
  },
  {
    desktopSrc: "/desktop3.jpg",
    mobileSrc: "/mobile3.jpeg",
    alt: "Luxury Perfume Banner 3",
    href: "/products/salim-luxury-attar",
    linkClassName:
      "left-[1%] top-[55%] sm:left-[10%] sm:top-[46%] md:left-[19%] md:top-[70%]",
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
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              quality={82}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 100vw, 100vw"
              className="hidden h-full w-full object-cover object-center md:block"
            />
            <Image
              src={image.mobileSrc}
              alt={image.alt}
              width={780}
              height={1500}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              quality={82}
              sizes="(max-width:640px) 100vw, (max-width:1024px) 100vw, 100vw"
              className="h-full w-full object-cover object-center md:hidden"
            />
            <Link
              href={image.href}
              aria-label={image.isImageButtonLink ? "Build Your Signature" : undefined}
              className={
                image.isImageButtonLink
                  ? `absolute z-10 cursor-pointer ${image.linkClassName}`
                  : `absolute z-10 mt-4 inline-block cursor-pointer rounded-full border border-[#f8d772] bg-gradient-to-r from-[#fff1a8] via-[#e6bc4c] to-[#e4ab39] px-4 py-2 text-[13px] font-semibold text-[#672380] shadow-[0_10px_28px_rgba(70,26,4,0.35),inset_0_1px_0_rgba(255,255,255,0.7)] transition duration-300 ease-in-out hover:translate-x-1 hover:from-[#fff6bf] hover:via-[#f0c84d] hover:to-[#c89222] hover:text-[#3a0d4d] hover:shadow-[0_12px_34px_rgba(70,26,4,0.45),inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-6 sm:py-2.5 sm:text-[18px] md:mt-5 md:text-[19px] ${image.linkClassName}`
              }
            >
              {image.isImageButtonLink ? <span className="sr-only">Build Your Signature</span> : "Shop Now "}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
