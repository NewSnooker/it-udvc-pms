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

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const portfolioName = decodeURIComponent(params.slug);
  const baseUrl = "https://it-udvc-pms.vercel.app";
  const { id = "" } = searchParams;
  if (!id) {
    return notFound();
  }
  const profile = await getPortfolioByUserId(id as string);
  const profileImage =
    profile?.profileImage ||
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";

  return {
    title: `Portfolio ${portfolioName} | ${WEBSITE_NAME}`,
    description: `Portfolio ${portfolioName} ใน ${WEBSITE_NAME} ระบบบริหารจัดการโครงการที่ครบครันและปรับแต่งได้`,
    openGraph: {
      title: `Portfolio ${portfolioName} | ${WEBSITE_NAME}`,
      description: `Portfolio ${portfolioName} ใน ${WEBSITE_NAME} ระบบบริหารจัดการโครงการที่ครบครันและปรับแต่งได้`,
      url: `${baseUrl}/portfolio/${portfolioName}`,
      type: "profile",
      images: [
        {
          url: `${baseUrl}${profileImage}`,
          width: 1200,
          height: 630,
          alt: `ภาพโปรไฟล์ของ ${portfolioName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Portfolio ${portfolioName} | ${WEBSITE_NAME}`,
      description: `Portfolio ${portfolioName} ใน ${WEBSITE_NAME} ระบบบริหารจัดการโครงการที่ครบครันและปรับแต่งได้`,
      images: [`${baseUrl}${profileImage}`],
    },
  };
}

export default async function page({
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

  return (
    <div className="">
      <PortfolioPage
        projects={projects}
        profile={profile as PortfolioProfile}
        count={count}
      />
    </div>
  );
}
