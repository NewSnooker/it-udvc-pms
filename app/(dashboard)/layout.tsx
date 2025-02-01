import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import SidebarV2 from "@/components/pages/MobileNavigation";
import { authOptions } from "@/config/auth";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { Metadata } from "next";
import { WEBSITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: {
    template: `%s | ${WEBSITE_NAME}`,
    default: `${WEBSITE_NAME}`,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session) {
    redirect("/login");
  }
  if (role === UserRole.CLIENT) {
    redirect("/my-projects");
  }
  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-[280px_1fr]">
      <Sidebar session={session} />
      {/* <SidebarV2 /> */}
      <div className="flex flex-col">
        <Navbar session={session} />
        {children}
      </div>
    </div>
  );
}
