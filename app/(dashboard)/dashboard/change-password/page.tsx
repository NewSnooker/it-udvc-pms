import { getUserById } from "@/actions/users";
import ChangPasswordForm from "@/components/Forms/ChangPasswordForm";
import { getAuthUser } from "@/config/getAuthUser";
import React from "react";
export const metadata = {
  title: "เปลี่ยนรหัสผ่าน",
};
export default async function page() {
  const user = await getAuthUser();
  const userDetails = await getUserById(user?.id ?? "");
  return (
    <div className="px-6 pb-8">
      <ChangPasswordForm initialData={userDetails} editingId={user?.id} />
    </div>
  );
}
