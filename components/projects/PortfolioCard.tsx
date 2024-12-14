"use client";
import Image from "next/image";
import { FollowerPointerCard } from "../ui/following-pointer";
import { ProjectWithUser } from "@/types/types";
import moment from "moment";
import "moment/locale/th";
import Link from "next/link";
moment.locale("th");

export function PortfolioCard({ project }: { project: ProjectWithUser }) {
  return (
    <div className="w-80 mx-auto">
      <FollowerPointerCard
        title={
          <TitleComponent
            title={project.user?.name || ""}
            avatar={project.user?.image ?? "/placeholder.svg"}
          />
        }
      >
        <div className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white dark:bg-zinc-900  hover:shadow-xl border ">
          <div className="w-full aspect-w-16 aspect-h-10 bg-gray-100 dark:bg-background rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
            <Image
              src={project.thumbnail ?? "/placeholder.svg"}
              alt={project.name}
              width={300}
              height={300}
              objectFit="cover"
              className={`w-full h-[200px] group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 `}
            />
          </div>
          <div className=" p-4">
            <h2 className="font-bold my-4 text-lg text-zinc-700 dark:text-zinc-200">
              {project.name}
            </h2>
            <h2 className="font-normal my-4 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-4">
              {project.description}
            </h2>
            <div className="flex flex-row justify-between items-center mt-10">
              <span className="text-sm text-gray-500 dark:text-zinc-400">
                {moment(project.startDate).format("L")}
              </span>
              <Link
                href="#"
                className="relative z-10 px-6 py-2 bg-black text-white font-bold rounded-xl block text-xs cursor-none"
              >
                ดูเพิ่มเติม
              </Link>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  );
}

const blogContent = {
  slug: "amazing-tailwindcss-grid-layouts",
  author: "Manu Arora",
  date: "28th March, 2023",
  title: "Amazing Tailwindcss Grid Layout Examples",
  description:
    "Grids are cool, but Tailwindcss grids are cooler. In this article, we will learn how to create amazing Grid layouts with Tailwindcs grid and React.",
  image: "/demo/thumbnail.png",
  authorAvatar: "/manu.png",
};

const TitleComponent = ({
  title,
  avatar,
}: {
  title: string;
  avatar: string;
}) => (
  <div className="flex gap-x-1 items-center">
    <Image
      src={avatar}
      height="20"
      width="20"
      alt="thumbnail"
      className="rounded-full border-2 border-white"
    />
    <p>{title}</p>
  </div>
);
