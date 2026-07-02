"use client";

import dynamic from "next/dynamic";
import LazyWhenVisible from "@/components/LazyWhenVisible";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => null,
});

export default function DeferredFooter() {
  return (
    <LazyWhenVisible minHeight="520px" rootMargin="800px 0px">
      <Footer />
    </LazyWhenVisible>
  );
}
