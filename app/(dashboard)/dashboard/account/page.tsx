import { getUserById } from "@/actions/users";
import AccountForm from "@/components/Forms/AccountForm";
import { getAuthUser } from "@/config/getAuthUser";
import { notFound } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getAuthUser();
  if (!user) {
    notFound();
  }
  const id = user.id;
  const me = await getUserById(id);
  return (
    <div className="p-8">
      <AccountForm initialData={me} id={id} />
    </div>
  );
}
