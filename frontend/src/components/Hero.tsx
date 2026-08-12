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
    desktopSrc: "/desktop1.webp",
    mobileSrc: "/mobile2.png",
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
              width={1920}
              height={1080}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              className="hidden h-full w-full object-contain object-center md:block"
              style={{
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                width: "100%",
              }}
            />
            <img
              src={image.mobileSrc}
              alt={image.alt}
              width={1080}
              height={1920}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              className="h-full w-full object-contain object-center md:hidden"
              style={{
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                width: "100%",
              }}
            />
            <Link
              href={image.href}
              aria-label={image.isImageButtonLink ? "Build Your Signature" : "Shop Salim now"}
              style={
                image.isImageButtonLink
                  ? undefined
                  : {
                      left: "72.4%",
                      top: "75.6%",
                      transform: "translate(-50%, -50%)",
                    }
              }
              className={
                image.isImageButtonLink
                  ? `absolute z-10 cursor-pointer ${image.linkClassName}`
                  : "absolute z-20 inline-flex cursor-pointer items-center justify-center"
              }
            >
              {image.isImageButtonLink ? (
                <span className="sr-only">Build Your Signature</span>
              ) : (
                <span
                  style={{
                    alignItems: "center",
                    background: "#ffdc43",
                    border: "1px solid #ffec83",
                    borderRadius: "999px",
                    boxShadow:
                      "0 3px 0 rgba(120, 76, 0, 0.78), 0 10px 20px rgba(0, 0, 0, 0.34)",
                    color: "#000000",
                    display: "inline-flex",
                    fontSize: "12px",
                    fontWeight: 800,
                    height: "30px",
                    justifyContent: "center",
                    lineHeight: 1,
                    minWidth: "100px",
                    padding: "0 24px",
                  }}
                >
                  Shop now
                </span>
              )}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
