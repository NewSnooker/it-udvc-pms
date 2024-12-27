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
import { WEBSITE_NAME } from "@/constants";

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

  // สร้าง URL แบบเต็มรูปแบบสำหรับรูปโปรไฟล์
  const baseUrl = "https://it-udvc-pms.vercel.app";
  const defaultImage =
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  // ตรวจสอบว่า profile.profileImage มี http หรือ https นำหน้าหรือไม่
  const profileImage = profile?.profileImage
    ? profile.profileImage.startsWith("http")
      ? profile.profileImage
      : `${baseUrl}${profile.profileImage}`
    : defaultImage;

  return (
    <>
      <head>
        <title>{`Portfolio ${portfolioName} | ${WEBSITE_NAME}`}</title>
        <meta
          name="description"
          content={`Portfolio ${portfolioName} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`}
        />
        {/* แก้ไข og:image และ twitter:image ให้ใช้ URL แบบเต็ม */}
        <meta property="og:title" content={`Portfolio ${portfolioName}`} />
        <meta
          property="og:description"
          content={`Portfolio ${portfolioName} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`}
        />
        <meta
          property="og:url"
          content={`${baseUrl}/portfolio/${portfolioName}?id=${id}`}
        />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content={profileImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Portfolio ${portfolioName}`} />
        <meta
          name="twitter:description"
          content={`Portfolio ${portfolioName} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`}
        />
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
