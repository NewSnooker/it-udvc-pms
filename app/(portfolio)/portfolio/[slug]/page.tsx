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
  return {
    title: `Portfolio ${decodeURIComponent(params.slug)} | ${WEBSITE_NAME}`,
    description: `Portfolio ${decodeURIComponent(
      params.slug
    )} ใน ${WEBSITE_NAME} เป็นแพลตฟอร์มสำหรับมืออาชีพด้านไอทีที่ต้องการค้นหาและเชื่อมต่อกับผู้เชี่ยวชาญไอทีคนอื่น ๆ
  พอร์ตโฟลิโอของคุณสามารถแสดงประสบการณ์การทำงาน โครงการที่สำเร็จ ทักษะที่เชี่ยวชาญ และความสำเร็จส่วนตัว
  เพื่อช่วยสร้างความน่าเชื่อถือและเปิดโอกาสในการร่วมงานกับผู้ว่าจ้างหรือทีมงานในอนาคต`,
  };
}

export default async function page({
  param,
  searchParams,
}: {
  param: { slug: string };
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
