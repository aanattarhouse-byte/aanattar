import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee6d9] sm:aspect-[16/7] lg:aspect-[4080/1913]">
      <Image
        src="/hero1.png"
        alt="Luxury Perfume Banner"
        fill
        priority
        sizes="100vw"
        className="object-contain"
      />
    </section>
  );
}
