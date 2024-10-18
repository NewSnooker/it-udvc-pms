import { getUserClient } from "@/actions/clients";
import { getProjectById } from "@/actions/projects";
import ProjectForm from "@/components/Forms/ProjectForm";
import { getAuthUser } from "@/config/getAuthUser";
import React from "react";

export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const project = await getProjectById(id);
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
      <ProjectForm initialData={project} clients={userClients} editingId={id} />
    </div>
  );
}
