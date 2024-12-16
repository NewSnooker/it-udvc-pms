import { getDetailUserProjects } from "@/actions/projects";
import ProjectPayments from "@/components/dashboard/ProjectPayments";
import { getAuthUser } from "@/config/getAuthUser";
import { DetailedUserProjects } from "@/types/types";
import React from "react";
export const metadata = {
  title: "การชําระเงิน",
};
export default async function page() {
  const user = await getAuthUser();
  const userProjects = (await getDetailUserProjects(user?.id)) || [];
  // console.log("userProjects", userProjects);

  return (
    // <div>
    //   {userProjects.length > 0 ? <div>ไม่มีโครงการ</div> : <div>เสร็จแล้ว</div>}
    // </div>
    <ProjectPayments
      userProject={userProjects as unknown as DetailedUserProjects[]}
    />
  );
}
