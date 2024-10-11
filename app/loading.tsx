"use client";
import Lottie from "lottie-react";
import React from "react";
import LoaderAnimation from "../public/loader.json";
export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[200px] ">
          <Lottie animationData={LoaderAnimation} />
          <div className="pt-4 flex items-center justify-center ">
            <div className="text-muted-foreground text-sm">Loading...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
