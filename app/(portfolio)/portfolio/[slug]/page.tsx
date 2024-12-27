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
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const portfolioName = decodeURIComponent(params.slug);
  const baseUrl = "https://it-udvc-pms.vercel.app";
  return {
    title: `Portfolio ${portfolioName} | ${WEBSITE_NAME}`,
    description: `Portfolio ${portfolioName} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`,
    openGraph: {
      title: `Portfolio ${portfolioName} | ${WEBSITE_NAME}`,
      description: `Portfolio ${portfolioName} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`,
      url: baseUrl,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `Portfolio ${portfolioName} | ${WEBSITE_NAME}`,
      description: `Portfolio ${portfolioName} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`,
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
