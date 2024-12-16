import { getProjectDetailBySlug } from "@/actions/projects";
import { getExistingUsers } from "@/actions/users";
import ProjectDetailsPage from "@/components/projects/ProjectDetailsPage";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { WEBSITE_NAME } from "@/constants";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: `${decodeURIComponent(params.slug)}`,
    description: `รายละเอียดโครงการ ${decodeURIComponent(
      params.slug
    )} ใน ${WEBSITE_NAME} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา`,
  };
}
export default async function page({ params }: { params: { slug: string } }) {
  const projectData = await getProjectDetailBySlug(params.slug);
  const existingUsers = await getExistingUsers();

  if (!existingUsers) {
    return <div>ไม่พบผู้ใช้</div>;
  }
  if (!projectData) {
    return <div>ไม่พบโครงการ</div>;
  }

  const session = await getServerSession(authOptions);
  const returnUrl = `/project/${params.slug}`;
  if (!session) {
    redirect(`/login?returnUrl=${returnUrl}`);
  }

  return (
    <div>
      <ProjectDetailsPage
        projectData={projectData}
        existingUsers={existingUsers}
        session={session}
      />
    </div>
  );
}
