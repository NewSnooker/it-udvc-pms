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
import { PortfolioCardFooter } from "./projects/PortfolioCardFooter";
import emptyFolder from "@/public/images/empty-folder.png";

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
    { Icon: RiThreadsFill, href: profile.threadsUrl, name: "Threads" },

    { Icon: Github, href: profile.githubUrl, name: "GitHub" },
    { Icon: Instagram, href: profile.instagramUrl, name: "Instagram" },
    { Icon: Facebook, href: profile.facebookUrl, name: "Facebook" },
    { Icon: Youtube, href: profile.youtubeUrl, name: "YouTube" },
    { Icon: Linkedin, href: profile.linkedinUrl, name: "LinkedIn" },
    {
      Icon: Mail,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=Your+Subject+Here&body=Your+Body+Text+Here`,
      name: "Mail",
    },
  ];
  const fourProjects = projects.slice(0, 2);
  const otherProjects = projects.slice(2);
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="mx-auto sm:max-w-7xl py-8 md:p-8">
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
            <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md">
              <SubscribeForm userId={profile.userId} />
            </div>

            <div className="relative flex justify-center w-full">
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
                            <Tooltip delayDuration={100}>
                              <TooltipTrigger asChild>
                                <Icon className="size-full" />
                              </TooltipTrigger>
                              <TooltipContent sideOffset={4} align="center">
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
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-2 md:gap-4 my-8 ">
              {fourProjects.map((project, index) => (
                <PortfolioCard key={index} project={project} />
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center min-h-[calc(100vh-16rem)] ">
              <div className=" flex flex-col justify-center items-center">
                <Image
                  src={emptyFolder}
                  alt="empty"
                  height={224}
                  width={224}
                  className="h-24 w-24  object-cover "
                />
                <p className="text-lg text-muted-foreground mt-4 mb-6">
                  ไม่พบโครงการ
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        {otherProjects.length > 0 && (
          <div className="flex justify-center">
            <PortfolioCardFooter projects={otherProjects} />
          </div>
        )}
      </div>
    </div>
  );
}
