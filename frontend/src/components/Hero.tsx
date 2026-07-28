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
    desktopSrc: "/desktop0.webp",
    mobileSrc: "/mobile0.webp",
    alt: "Luxury Perfume Banner 1",
    href: "/products/salim-luxury-attar",
    linkClassName:
      "left-[72%] top-[62%] sm:left-[286%] sm:top-[60%] md:left-[58%] md:top-[73%]",
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
