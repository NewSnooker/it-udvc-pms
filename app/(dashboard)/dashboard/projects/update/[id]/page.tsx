import { getUserById } from "@/actions/users";
import ClientForm from "@/components/Forms/ClientForm";
import React from "react";

export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getUserById(id);
  return (
    <div className="p-8">
      <ClientForm initialData={user} editingId={id} />
    </div>
  );
}
