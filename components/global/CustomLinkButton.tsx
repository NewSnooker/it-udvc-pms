"use client";
import React from "react";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
type CustomLinkButton = {
  href: string;
  title: string;
};
export function CustomLinkButton({ href, title }: CustomLinkButton) {
  return (
    <div>
      <Link href={href}>
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-zinc-900 text-black dark:text-white px-6"
        >
          {title}
        </Button>
      </Link>
    </div>
  );
}
