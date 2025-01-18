import { getUserSubscribersByUserId } from "@/actions/subscribe";
import Subscribers from "@/components/dashboard/Subscribers";
import { getAuthUser } from "@/config/getAuthUser";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import DataTable from "@/components/DataTableComponents/DataTable";
import { columns } from "./columns";
import React from "react";
import { Subscriber } from "@prisma/client";
export const metadata = {
  title: "ผู้ติดตาม",
};
export default async function page() {
  const user = await getAuthUser();
  const subscribers: Subscriber[] =
    (await getUserSubscribersByUserId(user?.id ?? "")) || [];
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <TableHeader
          title="ผู้ติดตาม"
          data={subscribers}
          model=""
          userId={user?.id ?? ""}
        />
        <div className="py-4">
          <DataTable data={subscribers} columns={columns} />
        </div>
      </div>
    </div>
  );
}
