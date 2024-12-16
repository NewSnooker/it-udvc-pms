import React from "react";
import { columns } from "./columns";
import { User } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getUserClient } from "@/actions/clients";
import { getAuthUser } from "@/config/getAuthUser";
export const metadata = {
  title: "ลูกค้า",
};
export default async function page() {
  const user = await getAuthUser();
  const clients: User[] = (await getUserClient(user?.id)) || [];

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
