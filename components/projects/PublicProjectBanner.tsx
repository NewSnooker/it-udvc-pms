import Image from "next/image";
import React, { useState } from "react";
export default function PublicProjectBanner({
  banner,
  name,
  bg,
}: {
  banner: string | null;
  name: string | null;
  bg: string | null;
}) {
  const gradients = [
    "bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    "bg-gradient-to-r from-[#4158d0] via-[#c850c0] to-[#ffcc70]",
    "bg-gradient-to-r from-[#fa8bff] via-[#2bd2ff] to-[#2bff88]",
    "bg-gradient-to-r from-[#f878ff] via-[#ffda9e] to-[#ffffff]",
    "bg-gradient-to-r from-[#ff004c] via-[#ffffff] to-[#0099ff]",
    "bg-gradient-to-r from-[#ff045c] to-[#fffdd0]",
    "bg-gradient-to-r from-[#a7d5f2] to-[#efc6ff]",
    "bg-gradient-to-r from-[#fdfcfb] to-[#e2d1c3]",
    "bg-gradient-to-r from-[#ffffff] to-[#d4dfed]",
    "bg-gradient-to-r from-[#62cff4] to-[#2c67f2]",
    "bg-gradient-to-r from-[#004ff9] to-[#000000]",
    "bg-gradient-to-r from-[#000000] to-[#444444]",
  ];
  const initialGradient = bg || gradients[0];
  const initialImage = banner || "/banner.jpg?height=250&width=1700";
  const [gradient, setGradient] = useState(initialGradient);
  const [imageUrl, setImageUrl] = useState(initialImage);
  return (
    <div className="relative  h-60 rounded-lg overflow-hidden group">
      <Image
        src={imageUrl}
        alt="Project Banner"
        className="absolute inset-0 w-full h-full object-cover"
        height={250}
        width={1700}
      />

      <div
        className={`absolute inset-0 opacity-60 dark:opacity-75 ${gradient}`}
      />
      <div className="absolute inset-0 flex items-center justify-center flex-col sm:flex-row">
        <div className="mt-6 sm:mt-0 sm:ml-10">
          <h1 className="text-4xl font-bold text-white text-center">{name}</h1>
        </div>
      </div>
    </div>
  );
}
