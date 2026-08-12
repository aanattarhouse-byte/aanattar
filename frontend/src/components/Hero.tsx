import Image from "next/image";
import Link from "next/link";

type HeroSlide = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  href: string;
  isImageButtonLink?: boolean;
  linkClassName: string;
};

const heroSlides: HeroSlide[] = [
  {
    desktopSrc: "/dekstop2.png",
    mobileSrc: "/mobile2.png",
    alt: "Luxury Perfume Banner",
    href: "/products/salim-luxury-attar",
    linkClassName:
      "left-[30.5%] top-[85.9%] h-[5%] w-[39%] md:left-[6%] md:top-[61.4%] md:h-[9%] md:w-[14%]",
  },
  // {
  //   desktopSrc: "/desktop2.webp",
  //   mobileSrc: "/mobile2.webp",
  //   alt: "Luxury Perfume Banner 2",
  //   href: "/build-your-signature",
  //   isImageButtonLink: true,
  //   linkClassName:
  //     "left-[32%] top-[40%] h-[6%] w-[35%] md:left-[69%] md:top-[87%] md:h-[8%] md:w-[18%]",
  // },
  // {
  //   desktopSrc: "/desktop3.jpg",
  //   mobileSrc: "/mobile3.jpeg",
  //   alt: "Luxury Perfume Banner 3",
  //   href: "/products/salim-luxury-attar",
  //   linkClassName:
  //     "left-[1%] top-[55%] sm:left-[10%] sm:top-[46%] md:left-[19%] md:top-[70%]",
  // },
];

export default function Hero() {
  const scrollingImages = heroSlides.length > 1 ? [...heroSlides, heroSlides[0]] : heroSlides;
  const shouldScroll = heroSlides.length > 1;

  return (
    <section className="relative w-full overflow-hidden bg-black md:h-[75vh] lg:h-[calc(100vh-82px)] lg:max-h-screen">
      <div className={`${shouldScroll ? "hero-scroll-track" : ""} flex md:h-full`}>
        {scrollingImages.map((image, index) => (
          <div
            key={`${image.desktopSrc}-${image.mobileSrc}-${index}`}
            className="relative w-full shrink-0 md:h-full"
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
              className="h-auto w-full object-contain md:hidden"
            />
            <Link
              href={image.href}
              aria-label={image.isImageButtonLink ? "Build Your Signature" : undefined}
              className={
                image.isImageButtonLink
                  ? `absolute z-10 cursor-pointer ${image.linkClassName}`
                  : `absolute z-10 cursor-pointer ${image.linkClassName}`
              }
            >
              <span className="sr-only">
                {image.isImageButtonLink ? "Build Your Signature" : "Shop Salim now"}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
