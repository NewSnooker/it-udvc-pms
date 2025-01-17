import TableHeader from "@/components/dashboard/Tables/TableHeader";
import DataTable from "@/components/DataTableComponents/DataTable";
import { getAuthUser } from "@/config/getAuthUser";
import { GuestProject } from "@prisma/client";
import React from "react";
import { columns } from "./columns";
import { getUserGuestProjects } from "@/actions/guestProject";
import { GuestProjectUserProps } from "@/types/types";
export const metadata = {
  title: "โครงการที่ได้เข้าร่วม",
};

export default async function page() {
  const user = await getAuthUser();
  const guestProjects: GuestProjectUserProps[] =
    (await getUserGuestProjects(user?.id)) || [];
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <TableHeader
          title="โครงการที่ได้เข้าร่วม"
          data={guestProjects}
          model=""
          userId={user?.id ?? ""}
        />
        <div className="py-4">
          <DataTable data={guestProjects} columns={columns} />
        </div>
      </div>
    </div>
  );
}
