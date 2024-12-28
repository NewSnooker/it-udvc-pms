import { getPortfolioByUserId } from "@/actions/portfolio";
import { getUserPublicProjects } from "@/actions/projects";
import PortfolioPage from "@/components/PortfolioPage";
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
  const profile = await getPortfolioByUserId(params.slug as string);

  const profileImage =
    profile?.profileImage ??
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  const name = profile?.name ?? "";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return {
    title: `Portfolio ${name} | ${WEBSITE_NAME}`,
    description: `Portfolio ใน ${WEBSITE_NAME} รวมโครงการที่โดดเด่นและบุคคลที่มีบทบาทสำคัญบนแพลตฟอร์มของเรา เพิ่มโอกาสในการเชื่อมต่อและสร้างแรงบันดาลใจจากผลงานระดับมืออาชีพ`,

    openGraph: {
      title: `Portfolio ${name} | ${WEBSITE_NAME}`,
      description: `Portfolio ใน ${WEBSITE_NAME} รวมโครงการที่โดดเด่นและบุคคลที่มีบทบาทสำคัญบนแพลตฟอร์มของเรา เพิ่มโอกาสในการเชื่อมต่อและสร้างแรงบันดาลใจจากผลงานระดับมืออาชีพ`,
      url: `${baseUrl}/portfolio/${params.slug}`,
      type: "profile",
      images: [
        {
          url: profileImage,
          width: 800,
          height: 600,
          alt: "Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Portfolio | ${WEBSITE_NAME}`,
      description: `Portfolio ใน ${WEBSITE_NAME} รวมโครงการที่โดดเด่นและบุคคลที่มีบทบาทสำคัญบนแพลตฟอร์มของเรา เพิ่มโอกาสในการเชื่อมต่อและสร้างแรงบันดาลใจจากผลงานระดับมืออาชีพ`,
      site: `${baseUrl}/portfolio/${params.slug}`,
      images: [profileImage],
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
  const profile = await getPortfolioByUserId(params.slug as string);
  if (!profile) {
    return notFound();
  }
  const projects = (await getUserPublicProjects(params.slug as string)) || [];
  const count = projects.length || 0;

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
