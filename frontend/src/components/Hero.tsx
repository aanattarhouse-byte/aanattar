import Link from "next/link";

type HeroSlide = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  href: string;
  isImageButtonLink?: boolean;
  linkClassName?: string;
};

const heroSlides: HeroSlide[] = [
  // {
  //   desktopSrc: "/dekstop2.png",
  //   mobileSrc: "/mobile2.png",
  //   alt: "Luxury Perfume Banner",
  //   href: "/products/salim-luxury-attar",
  //   linkClassName:
  //     "left-[20.5%] top-[55.9%] h-[5%] w-[39%] md:left-[6%] md:top-[61.4%] md:h-[9%] md:w-[14%]",
  // },
  {
    desktopSrc: "/desktop2.png",
    mobileSrc: "/mobile1.webp",
    alt: "Salim Luxury Attar offer banner",
    href: "/products/salim-luxury-attar",
  },
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
  const heroBackground =
    "radial-gradient(circle at 50% 0%, rgba(255, 179, 71, 0.12), transparent 34rem), linear-gradient(180deg, #0b0b0b 0%, #111111 52%, #0b0b0b 100%)";

  return (
    <section
      className="hero-section relative flex w-full overflow-hidden"
      style={{
        background: heroBackground,
        height: "calc(100svh - var(--hero-visible-offset, 83px))",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <div
        className={`${shouldScroll ? "hero-scroll-track" : ""} flex`}
        style={{ height: "100%", width: "100%" }}
      >
        {scrollingImages.map((image, index) => (
          <div
            key={`${image.desktopSrc}-${image.mobileSrc}-${index}`}
            className="hero-slide relative flex shrink-0 items-center justify-center"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <img
              src={image.desktopSrc}
              alt={image.alt}
              width={1672}
              height={941}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              className="hero-image hero-image-desktop hidden md:block"
              style={{
                height: "100%",
                inset: 0,
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                width: "100%",
              }}
            />
            <img
              src={image.mobileSrc}
              alt={image.alt}
              width={3375}
              height={6000}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              className="hero-image block md:hidden"
              style={{
                height: "100%",
                inset: 0,
                objectFit: "contain",
                objectPosition: "center",
                position: "absolute",
                width: "100%",
              }}
            />
            
            {image.isImageButtonLink && (
              <Link
                href={image.href}
                aria-label="Build Your Signature"
                className={`absolute z-10 cursor-pointer ${image.linkClassName}`}
              >
                <span className="sr-only">Build Your Signature</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
