import React from "react";
import { Project } from "@prisma/client";
// import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getAuthUser } from "@/config/getAuthUser";
import { getMyProjectsClient } from "@/actions/projects";
import DataTable from "@/components/DataTableComponents/DataTable";
import { columns } from "./columns";
import TableHeaderClient from "@/components/dashboard/Tables/TableHeaderClient";

export const metadata = {
  title: "โครงการของฉัน",
};

export default async function Page() {
  const user = await getAuthUser();
  const projects: Project[] = (await getMyProjectsClient(user?.id)) || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <TableHeaderClient title="โครงการของฉัน" data={projects} />
        <div className="py-4">
          <DataTable data={projects} columns={columns} />
        </div>
      </div>
    </div>
  );
}
