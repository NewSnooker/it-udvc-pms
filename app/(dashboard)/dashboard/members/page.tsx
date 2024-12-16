import {
  getUserGuestProjects,
  getUserMemberProjects,
} from "@/actions/projects";
import GuestProjects from "@/components/dashboard/GuestProjects";
import { getAuthUser } from "@/config/getAuthUser";
import { GuestProject } from "@prisma/client";
import React from "react";
export const metadata = {
  title: "สมาชิกโครงการ",
};
export default async function page() {
  const user = await getAuthUser();
  const projects = await getUserMemberProjects(user?.id);

  if (!projects) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">ไม่พบโครงการ</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-2 lg:p-8">
      <div className="col-span-2">
        <GuestProjects
          isOwner={true}
          projects={projects as unknown as GuestProject[]}
        />
      </div>
    </div>
  );
}
