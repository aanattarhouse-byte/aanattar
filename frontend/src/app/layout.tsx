import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import DeferredFooter from "@/components/DeferredFooter";
import DeferredCinematicShell from "@/components/DeferredCinematicShell";
import MetaPixel from "@/components/MetaPixel";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { getInitialAuthUser } from "@/lib/auth";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theaanstory.com"),
  title: "Aan Attar | Premium Fragrance House",
  description: "Luxury attar experience. Curated scents, build your own, and exclusive gift sets crafted around Aan Attar signature.",
  keywords: ["attar", "luxury", "perfume", "fragrance", "Aan Attar"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aan Attar",
    description: "Premium luxury attar brand",
    url: "/",
    siteName: "Aan Attar",
    images: [
      {
        url: "/hero2.png",
        width: 1200,
        height: 676,
        alt: "Aan Attar premium fragrance house",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aan Attar | Premium Fragrance House",
    description: "Luxury attar experience crafted around Aan Attar signature.",
    images: ["/hero2.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getInitialAuthUser();
  const whatsappHref = "https://wa.me/918274934858";

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${lora.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html{background:#0b0b0b}body{margin:0;min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at 50% -20%,rgba(255,179,71,.13),transparent 34rem),linear-gradient(180deg,#0b0b0b 0%,#111 48%,#0b0b0b 100%);color:#fafafa}body::selection{background:rgba(251,191,36,.3);color:#fff}",
          }}
        />
        <MetaPixel />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0B0B0B] text-zinc-100 antialiased selection:bg-amber-400/30 selection:text-white pb-[60px] md:pb-0">
        <AuthProvider initialUser={initialUser}>
          <CartProvider>
            <DeferredCinematicShell />
            <Navbar />
            <main className="relative z-10 flex-1">{children}</main>
            <div className="relative z-10">
              <DeferredFooter />
            </div>
          </CartProvider>
        </AuthProvider>
        <a
          aria-label="Chat on WhatsApp +91 82749 34858"
          className="global-whatsapp-fixed"
          href={whatsappHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <svg aria-hidden="true" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16.02 3.2A12.7 12.7 0 0 0 5.1 22.38L3.7 28.8l6.55-1.72A12.68 12.68 0 1 0 16.02 3.2Zm0 2.3a10.39 10.39 0 0 1 8.8 15.9 10.39 10.39 0 0 1-13.72 3.4l-.47-.28-3.9 1.03.83-3.82-.31-.5A10.4 10.4 0 0 1 16.02 5.5Zm-4.23 4.72c-.22 0-.57.08-.87.42-.3.34-1.15 1.13-1.15 2.75s1.18 3.18 1.35 3.4c.17.23 2.28 3.65 5.63 4.97 2.79 1.1 3.36.88 3.96.82.6-.06 1.95-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.39-.34-.17-1.96-.97-2.27-1.08-.3-.11-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.72.08-.33-.17-1.4-.52-2.67-1.65-.99-.88-1.66-1.97-1.85-2.3-.2-.34-.02-.52.15-.69.15-.15.33-.39.5-.58.17-.2.22-.34.33-.56.11-.22.06-.42-.03-.59-.08-.17-.74-1.79-1.02-2.45-.27-.64-.54-.55-.74-.56h-.63Z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
