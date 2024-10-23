"use client";
import Lottie from "lottie-react";
import React from "react";
import LoaderAnimation from "../public/loader.json";
import underLoading from "../public/underLoading.json";
export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className=" w-[350px] sm:w-[600px] ">
          <Lottie animationData={LoaderAnimation} />
          <div className=" flex items-center justify-center ">
            <Lottie animationData={underLoading} />
          </div>
          {/* <div className="pt-4 flex items-center justify-center ">
            <div className="text-muted-foreground text-2xl">กำลังโหลด...</div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
