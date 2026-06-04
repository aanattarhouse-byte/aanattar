import BuildWardrobeClient from "@/components/BuildWardrobeClient";

export const metadata = {
  title: "Build Your Wardrobe | Aan Luxury Attar",
  description:
    "A curated fragrance wardrobe assistant with premium bestseller recommendations by occasion.",
};

export default function PremiumCollectionPage() {
  return <BuildWardrobeClient isPremiumCollection={true} />;
}

