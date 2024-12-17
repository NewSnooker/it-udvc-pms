"use client";

import * as React from "react";
import {
  Facebook,
  FolderPlus,
  Github,
  Instagram,
  Layout,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PortfolioCard } from "./projects/PortfolioCard";
import { ProjectWithUser } from "@/types/types";
import { PortfolioProfile } from "@prisma/client";
import Link from "next/link";
import { RiThreadsFill, RiTwitterXFill } from "react-icons/ri";
import { Dock, DockIcon } from "./ui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import SubscribeForm from "./Forms/SubscribeForm";

export default function PortfolioPage({
  projects,
  profile,
  count,
}: {
  projects: ProjectWithUser[];
  profile: PortfolioProfile;
  count: number;
}) {
  const router = useRouter();

  const socialLinks = [
    { Icon: RiTwitterXFill, href: profile.xUrl, name: "X" },
    {
      Icon: Mail,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=Your+Subject+Here&body=Your+Body+Text+Here`,
      name: "Mail",
    },
    { Icon: Github, href: profile.githubUrl, name: "GitHub" },
    { Icon: Linkedin, href: profile.linkedinUrl, name: "LinkedIn" },
    { Icon: Instagram, href: profile.instagramUrl, name: "Instagram" },
    { Icon: RiThreadsFill, href: profile.threadsUrl, name: "Threads" },
    { Icon: Facebook, href: profile.facebookUrl, name: "Facebook" },
    { Icon: Youtube, href: profile.youtubeUrl, name: "YouTube" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Sticky Profile Section */}
          <div className=" lg:sticky lg:top-8 lg:self-start">
            <div className="text-center">
              <div className=" border-4 mx-auto h-32 w-32 overflow-hidden rounded-full shadow-lg dark:shadow-xl mb-4">
                <Image
                  src={
                    profile.profileImage ??
                    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png"
                  }
                  alt={profile.name}
                  className="object-cover w-full h-full"
                  width={128}
                  height={128}
                />
              </div>
              <h1 className=" text-2xl mt-6 font-bold text-zinc-900 dark:text-zinc-100">
                {profile.name}
              </h1>
              <div className="text-zinc-600 dark:text-zinc-400 flex justify-center gap-4 mb-2 md:mb-4">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {profile.location}
                </div>
                <div className="flex items-center">
                  <Layout className="mr-1 h-4 w-4" />
                  {count} โครงการ
                </div>
              </div>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 text-center">
              {profile.description}
            </p>
            <div className=" border rounded-lg bg-zinc-100 dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                ติดตามข่าวสารของฉัน
              </p>

              <SubscribeForm userId={profile.id} />
            </div>

            <div className="relative flex justify-center">
              <TooltipProvider>
                <Dock magnification={60} distance={100} className="mt-4">
                  {socialLinks.map(
                    ({ Icon, href, name }) =>
                      href && (
                        <DockIcon
                          key={name}
                          className="bg-black/10 dark:bg-white/10 p-3"
                        >
                          <Link
                            href={href ?? ""}
                            target="_blank"
                            className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors duration-300"
                          >
                            <Tooltip delayDuration={200}>
                              <TooltipTrigger asChild>
                                <Icon className="size-full" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </Link>
                        </DockIcon>
                      )
                  )}
                </Dock>
              </TooltipProvider>
            </div>
          </div>
          {/* Scrollable Projects Grid */}
          {projects ? (
            <div className="grid md:grid-cols-2 gap-4 md:gap-8 h-[calc(100vh-4rem)] overflow-y-auto ">
              {projects.map((project, index) => (
                <PortfolioCard key={index} project={project} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center space-y-4 p-8">
                <div className="flex justify-center">
                  <FolderPlus className="h-16 w-16 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">ไม่พบโครงการ</h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
