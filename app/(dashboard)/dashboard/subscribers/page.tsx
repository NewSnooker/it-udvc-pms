import { getUserSubscribersByUserId } from "@/actions/subscribe";
import Subscribers from "@/components/dashboard/Subscribers";
import { getAuthUser } from "@/config/getAuthUser";
import React from "react";
export const metadata = {
  title: "อีเมลผู้ติดตาม",
};
export default async function page() {
  const user = await getAuthUser();
  const subscribers = (await getUserSubscribersByUserId(user?.id ?? "")) || [];
  return (
    <div className="p-2 lg:p-8">
      <Subscribers subscribers={subscribers} />
    </div>
  );
}
