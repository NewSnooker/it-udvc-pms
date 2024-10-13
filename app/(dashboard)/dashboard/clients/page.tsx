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
        title="ลูกค้า"
        linkTitle="เพิ่มลูกค้า"
        href="/dashboard/clients/new"
        data={clients}
        model="clients"
      />
      <div className="py-8">
        <DataTable data={clients} columns={columns} />
      </div>
    </div>
  );
}
