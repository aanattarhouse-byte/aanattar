"use client";

import dynamic from "next/dynamic";
import LazyWhenVisible from "@/components/LazyWhenVisible";

const VideoStoriesSection = dynamic(() => import("@/components/VideoStoriesSection"), {
  ssr: false,
});
const FounderVideo = dynamic(() => import("@/components/FounderVideo"), {
  ssr: false,
});
const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: false,
});

export default function LazyHomeMedia() {
  return (
    <>
      <LazyWhenVisible minHeight="620px">
        <VideoStoriesSection />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="720px">
        <FounderVideo />
      </LazyWhenVisible>
      <LazyWhenVisible minHeight="620px">
        <Testimonials />
      </LazyWhenVisible>
    </>
  );
}
