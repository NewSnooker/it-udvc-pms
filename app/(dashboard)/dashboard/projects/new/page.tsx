import { getUserClient } from "@/actions/clients";
import ProjectForm from "@/components/Forms/ProjectForm";
import { getAuthUser } from "@/config/getAuthUser";
import React from "react";
export const metadata = {
  title: "เพิ่มโครงการ",
};
export default async function page() {
  const user = await getAuthUser();
  const userId = user?.id;
  const clients = await getUserClient(userId);
  const userClients =
    clients?.map((client) => ({
      label: client.name,
      value: client.id,
    })) || [];
  return (
    <div className="p-8">
      <ProjectForm userId={userId} clients={userClients} />
    </div>
  );
}
