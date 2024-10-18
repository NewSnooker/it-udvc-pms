import { getProjectDetailBySlug } from "@/actions/projects";
import ProjectDetailsPage from "@/components/dashboard/projects/ProjectDetailsPage";
import React from "react";

export default async function page({ params }: { params: { slug: string } }) {
  const projectData = await getProjectDetailBySlug(params.slug);
  // console.log(projectData);
  if (!projectData) {
    return <div> ไม่พบโครงการ </div>;
  }
  return (
    <div>
      <ProjectDetailsPage projectData={projectData} />
    </div>
  );
}
