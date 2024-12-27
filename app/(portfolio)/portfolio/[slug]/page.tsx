import { getPortfolioByUserId } from "@/actions/portfolio";
import {
  getUserProjectsCount,
  getUserPublicProjects,
} from "@/actions/projects";
import PortfolioPage from "@/components/PortfolioPage";
import { getAuthUser } from "@/config/getAuthUser";
import { PortfolioProfile } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { WEBSITE_NAME } from "@/constants";

// metadata.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const portfolioName = decodeURIComponent(params.slug);
  const baseUrl = "https://it-udvc-pms.vercel.app";

  return {
    title: `Portfolio ${portfolioName} | ${WEBSITE_NAME}`,
    description: `Portfolio ${portfolioName} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id = "" } = searchParams;
  if (!id) {
    return notFound();
  }

  const user = await getAuthUser();
  const profile = await getPortfolioByUserId(id as string);
  const projects = (await getUserPublicProjects(id as string)) || [];
  const count = (await getUserProjectsCount(user?.id)) ?? 0;
  const portfolioName = decodeURIComponent(params.slug);
  const profileImage =
    profile?.profileImage ||
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  return (
    <>
      <head>
        <meta property="og:title" content={`Portfolio ${portfolioName}`} />
        <meta property="og:image" content={profileImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={profileImage} />
      </head>
      <div>
        <PortfolioPage
          projects={projects}
          profile={profile as PortfolioProfile}
          count={count}
        />
      </div>
    </>
  );
}
