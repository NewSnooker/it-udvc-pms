import { getProjectDetailBySlug } from "@/actions/projects";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { WEBSITE_NAME } from "@/constants";
import PublicProjectDetailsPage from "@/components/projects/PublicProjectDetailsPage";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const projectData = await getProjectDetailBySlug(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const projectName = projectData?.name ?? "โครงการที่ไม่ระบุชื่อ";
  const title = `${projectName} | ${WEBSITE_NAME}`;
  const thumbnail = projectData?.thumbnail ?? "/thumbnail.png";
  const url = `${baseUrl}/public/project/${params.slug}`;
  const description = `รายละเอียดโครงการ ${projectName} เป็นข้อมูลเกี่ยวกับโครงการและผู้มีส่วนเกี่ยวข้องในแพลตฟอร์มของเรา: ${
    projectData?.description ?? "ไม่มีข้อมูลเพิ่มเติม"
  }`;
  return {
    title: projectName,
    description: description,

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
  if (!projectData) {
    return notFound();
  }
  return (
    <div>
      <PublicProjectDetailsPage projectData={projectData} />
    </div>
  );
}
