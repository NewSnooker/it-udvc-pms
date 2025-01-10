import React from "react";
import { columns } from "./columns";
import { Project } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getAuthUser } from "@/config/getAuthUser";
import { getUserProjects } from "@/actions/projects";
export const metadata = {
  title: "โครงการ",
};
export default async function page() {
  const user = await getAuthUser();
  const projects: Project[] = (await getUserProjects(user?.id)) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <TableHeader
          title="โครงการ"
          linkTitle="เพิ่มโครงการ"
          href="/dashboard/projects/new"
          data={projects}
          model="projects"
        />
        <div className="py-4 sm:py-8">
          <DataTable data={projects} columns={columns} />
        </div>
      </div>
    </div>
  );
}
