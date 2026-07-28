"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export default function ShopSalimButton({
  children = "Shop Salim",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link href="/products/salim" className={className}>
      {children}
    </Link>
  );
}
