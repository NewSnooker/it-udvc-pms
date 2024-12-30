import { getUserClient } from "@/actions/clients";
import { getUserSubscribersByUserId } from "@/actions/subscribe";
import EmailCompose from "@/components/dashboard/EmailCompose";
import { getAuthUser } from "@/config/getAuthUser";
import { redirect } from "next/navigation";
import React from "react";
export const metadata = {
  title: "อีเมล",
};

export default async function page() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  } else {
    const clients = (await getUserClient(user.id ?? "")) || [];
    const subscribers = (await getUserSubscribersByUserId(user.id ?? "")) || [];
    return (
      <div>
        <EmailCompose clients={clients} subscribers={subscribers} user={user} />
      </div>
    );
  }
}
