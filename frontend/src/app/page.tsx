import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import WhyChooseAanStory from "@/components/WhyChooseAanStory";
import VideoStoriesSection from "@/components/VideoStoriesSection";
import FounderVideo from "@/components/FounderVideo";
import { getInitialAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getInitialAuthUser();

  if (user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  return (
    <main className="overflow-hidden">
      <Hero />
      <WhyChooseAanStory />
      <VideoStoriesSection />

      <FounderVideo />

      <Testimonials />
    </main>
  );
}
