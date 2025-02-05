"use client";
import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";

export function AnimatedAvatars({
  users,
}: {
  users: {
    id: string;
    name: string;
    image: string;
  }[];
}) {
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <AnimatedTooltip items={users} />
    </div>
  );
}
