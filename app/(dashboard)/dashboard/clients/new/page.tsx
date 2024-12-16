import ClientForm from "@/components/Forms/ClientForm";
import { getAuthUser } from "@/config/getAuthUser";
import React from "react";
export const metadata = {
  title: "เพิ่มลูกค้า",
};
export default async function page() {
  const user = await getAuthUser();

  return (
    <div className="p-8">
      <ClientForm userId={user?.id} />
    </div>
  );
}
