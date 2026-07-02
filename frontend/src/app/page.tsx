import Hero from "@/components/Hero";
import WhyChooseAanStory from "@/components/WhyChooseAanStory";
import LazyHomeMedia from "@/components/LazyHomeMedia";
import { getInitialAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getInitialAuthUser();

  if (user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  return (
    <main className="overflow-x-clip">
      <Hero />
      <WhyChooseAanStory />
      <LazyHomeMedia />
    </main>
  );
}
