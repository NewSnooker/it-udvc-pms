import React from "react";
import { columns } from "./columns";
import { Project } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getAuthUser } from "@/config/getAuthUser";
import { getUserProjects } from "@/actions/projects";

export default async function page() {
  const user = await getAuthUser();
  const projects: Project[] = (await getUserProjects(user?.id)) || [];

  return (
    <div className="p-8">
      <TableHeader
        title="โครงการ"
        linkTitle="เพิ่มโครงการ"
        href="/dashboard/projects/new"
        data={projects}
        model="projects"
      />
      <div className="pb-8 pt-4">
        <DataTable data={projects} columns={columns} model={"project"} />
      </div>
    </div>
  );
}
