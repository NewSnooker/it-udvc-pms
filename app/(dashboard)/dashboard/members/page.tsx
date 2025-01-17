import { getUserMemberProjects } from "@/actions/guestProject";
import GuestProjects from "@/components/dashboard/GuestProjects";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { getAuthUser } from "@/config/getAuthUser";
import { GuestProjectUserProps } from "@/types/types";
import { GuestProject } from "@prisma/client";
import React from "react";
import { columns } from "./columns";
import DataTable from "@/components/DataTableComponents/DataTable";
export const metadata = {
  title: "สมาชิกโครงการ",
};
export default async function page() {
  const user = await getAuthUser();
  const memberProjects: GuestProjectUserProps[] =
    (await getUserMemberProjects(user?.id)) || [];
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <TableHeader
          title="สมาชิกโครงการ"
          data={memberProjects}
          model=""
          userId={user?.id ?? ""}
        />
        <div className="py-4">
          <DataTable data={memberProjects} columns={columns} />
        </div>
      </div>
    </div>
  );
}
