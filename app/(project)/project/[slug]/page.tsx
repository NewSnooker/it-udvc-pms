import { getProjectDetailBySlug } from "@/actions/projects";
import { getExistingUsers } from "@/actions/users";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { WEBSITE_NAME } from "@/constants";
import { ExistingUsers } from "@/types/types";
import ProjectDetailsPage from "@/components/projects/ProjectDetailsPage";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const projectData = await getProjectDetailBySlug(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const projectName = projectData?.name ?? "โครงการที่ไม่ระบุชื่อ";
  const title = `${projectName} | ${WEBSITE_NAME}`;
  const thumbnail: string = projectData?.thumbnail ?? "/thumbnail.png";
  const url = `${baseUrl}/project/${params.slug}`;

  const description = `รายละเอียดโครงการ ${projectName} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา: ${
    projectData?.description ?? "ไม่มีข้อมูลเพิ่มเติม"
  }`;

  return {
    title: projectName,
    description: description,
    icons: {
      icon: thumbnail,
      shortcut: thumbnail,
      apple: thumbnail,
    },

    openGraph: {
      title: title,
      description: description,
      url: url,
      type: "website",
      images: [
        {
          url: thumbnail,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      site: url,
      images: [thumbnail],
    },
  };
}
export default async function page({ params }: { params: { slug: string } }) {
  const projectData = await getProjectDetailBySlug(params.slug);
  const existingUsers = await getExistingUsers();

  if (!existingUsers) {
    return notFound();
  }
  if (!projectData) {
    return notFound();
  }

  const session = await getServerSession(authOptions);
  const returnUrl = `/project/${params.slug}`;
  if (!session) {
    redirect(`/login?returnUrl=${returnUrl}`);
  }

  return (
    <ProjectDetailsPage
      projectData={projectData}
      existingUsers={existingUsers as ExistingUsers[]}
      session={session}
    />
  );
}
