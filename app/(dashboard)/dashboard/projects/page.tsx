import React from "react";
import { columns } from "./columns";
import { Category, User } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getAllClient } from "@/actions/clients";

export default async function page() {
  const clients: User[] = (await getAllClient()) || [];

  return (
    <div className="p-8">
      <TableHeader
        title="โครงงาน"
        linkTitle="เพิ่มโครงงาน"
        href="/dashboard/projects/new"
        data={clients}
        model="projects"
      />
      <div className="py-8">
        <DataTable data={clients} columns={columns} />
      </div>
    </div>
  );
}
