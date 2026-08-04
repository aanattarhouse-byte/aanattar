import Link from "next/link";

export default function AnimatedSignatureHeader() {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        Build Your Signature
      </p>

      <h1 className="mt-3 text-3xl font-semibold leading-tight text-white drop-shadow-[0_8px_34px_rgba(255,179,71,0.18)] sm:text-4xl md:text-5xl">
        Choose the attar that enters before you do.
      </h1>

      <p className="mt-4 max-w-xl text-sm text-zinc-300 md:text-base">
        Explore the full Aan Attar collection, from royal oudh
        blends to clean musks, botanical florals, and modern elite
        inspirations.
      </p>
      
      <Link
        href="/build-your-wardrobe"
        prefetch={false}
        className="mt-6 inline-flex h-10 items-center rounded-[8px] border border-amber-300/40 bg-white/5 px-5 text-xs font-bold uppercase tracking-[0.1em] text-amber-100 transition hover:bg-amber-300 hover:text-black"
      >
        Build Your Wardrobe
      </Link>
    </div>
  );
}
