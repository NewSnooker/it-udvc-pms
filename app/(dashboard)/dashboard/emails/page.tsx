import { getUserClient } from "@/actions/clients";
import {
  getUserGuestProjectsEmail,
  getUserMemberProjectsEmail,
} from "@/actions/guestProject";
import { getUserSubscribersByUserId } from "@/actions/subscribe";
import EmailCompose from "@/components/dashboard/EmailCompose";
import { getAuthUser } from "@/config/getAuthUser";
import { redirect } from "next/navigation";
import React from "react";
export const metadata = {
  title: "อีเมล",
};

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  } else {
    const { mail, role } = searchParams;
    const clients = (await getUserClient(user.id ?? "")) || [];
    const subscribers = (await getUserSubscribersByUserId(user.id ?? "")) || [];
    const members = (await getUserMemberProjectsEmail(user.id ?? "")) || [];
    const owners = (await getUserGuestProjectsEmail(user.id ?? "")) || [];
    console.log(owners);
    return (
      <div>
        <EmailCompose
          clients={clients}
          subscribers={subscribers}
          members={members}
          owners={owners}
          user={user}
          mail={mail}
          role={role}
        />
      </div>
    );
  }
}
