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
        title="โครงงาน"
        linkTitle="เพิ่มโครงงาน"
        href="/dashboard/projects/new"
        data={projects}
        model="projects"
      />
      <div className="py-8">
        <DataTable data={projects} columns={columns} />
      </div>
    </div>
  );
}
