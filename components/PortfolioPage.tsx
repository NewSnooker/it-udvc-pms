"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderPlus, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PortfolioCard } from "./projects/PortfolioCard";
import { ProjectWithUser } from "@/types/types";

export default function PortfolioPage({
  projects,
}: {
  projects: ProjectWithUser[];
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Sticky Profile Section */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <div className="text-center">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full shadow-lg dark:shadow-xl">
                <Image
                  src="/placeholder.svg"
                  alt="Profile"
                  className="object-cover w-full h-full"
                  width={128}
                  height={128}
                />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Your Name
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                📍 Location • $XXX/month
              </p>
            </div>

            <p className="text-zinc-700 dark:text-zinc-300">
              Share your story here. Make it compelling and authentic.
            </p>

            <div className="space-y-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 p-4 shadow-sm dark:shadow-none">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                Subscribe to my newsletter
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Your email..."
                  className="
                    bg-white dark:bg-zinc-800
                    border-zinc-300 dark:border-zinc-700
                    text-zinc-900 dark:text-zinc-100
                  "
                />
                <Button variant="default">Subscribe</Button>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {[
                { Icon: Twitter, href: "#" },
                { Icon: Github, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Instagram, href: "#" },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="
                    text-zinc-500 hover:text-zinc-800
                    dark:text-zinc-400 dark:hover:text-zinc-100
                    transition-colors duration-300
                  "
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          {/* Scrollable Projects Grid */}
          {projects ? (
            <div className="grid gap-4 md:grid-cols-2 h-[calc(100vh-4rem)] overflow-y-auto">
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
