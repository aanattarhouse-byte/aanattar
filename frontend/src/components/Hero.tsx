import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#eee6d9]">
      <Image
        src="/hero1.png"
        alt="Luxury Perfume Banner"
        width={6000}
        height={2813}
        priority
        sizes="100vw"
        className="w-full h-auto"
      />
    </section>
  );
}
