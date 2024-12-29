import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import Image from "next/image";
import { ProjectWithUser } from "@/types/types";
import moment from "moment";
import "moment/locale/th";
import Link from "next/link";
moment.locale("th");

const ReviewCard = ({ item }: { item: ProjectWithUser }) => {
  return (
    <Link href={`/public/project/${item.slug}`}>
      <figure
        className={cn(
          "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
          // light styles
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          // dark styles
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            className="rounded-full w-[50px] h-[50px] object-cover"
            width={50}
            height={50}
            alt={item.name}
            src={item.thumbnail ?? "/placeholder.svg"}
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">
              {item.name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">
              {moment(item.startDate).format("L")}
            </p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm line-clamp-1">
          {item.description}
        </blockquote>
      </figure>
    </Link>
  );
};

export function PortfolioCardFooter({
  projects,
}: {
  projects: ProjectWithUser[];
}) {
  return (
    <div className="relative flex h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background ">
      <Marquee pauseOnHover className="[--duration:20s]">
        {projects.map((item, i) => (
          <ReviewCard key={i} item={item} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
