import React from "react";
import { columns } from "./columns";
import { User } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getUserClient } from "@/actions/clients";
import { getAuthUser } from "@/config/getAuthUser";

export default async function page() {
  const user = await getAuthUser();
  const clients: User[] = (await getUserClient(user?.id)) || [];

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
