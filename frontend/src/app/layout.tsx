import type { Metadata, Viewport } from "next";
import { Playfair_Display, Lora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicShell from "@/components/cinematic/CinematicShell";
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
  title: "Salim Luxury Attar | Premium Fragrance House",
  description: "Luxury attar experience. Curated scents, build your own, and exclusive gift sets crafted around Salim Luxury Attar signature.",
  keywords: ["attar", "luxury", "perfume", "fragrance", "Salim Luxury Attar"],
  openGraph: {
    title: "Salim Luxury Attar",
    description: "Premium luxury attar brand",
    type: "website",
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

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${lora.variable} ${spaceGrotesk.variable} h-full scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#0B0B0B] text-zinc-100 antialiased selection:bg-amber-400/30 selection:text-white">
        <AuthProvider initialUser={initialUser}>
          <CartProvider>
            <CinematicShell />
            <Navbar />
            <main className="relative z-10 flex-1">{children}</main>
            <div className="relative z-10">
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
