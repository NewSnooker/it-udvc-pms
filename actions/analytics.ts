"use server";

import { db } from "@/prisma/db";
import { UserRole } from "@prisma/client";
import {
  Banknote,
  LayoutGrid,
  LucideProps,
  User2,
  UsersRound,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
export type AnalyticsProps = {
  title: string;
  total: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export async function getDashboardOverview(userId: string | undefined) {
  try {
    if (userId) {
      const projects = await db.project.findMany({
        where: {
          userId,
        },
      });
      const clientCount = await db.user.count({
        where: {
          userId,
          role: UserRole.CLIENT,
        },
      });
      const projectCount = await db.project.count({
        where: {
          userId,
        },
      });
      const guestProjectCount = await db.guestProject.count({
        where: {
          ownerId: userId,
        },
      });
      const totalRevenue =
        projects && projects.length > 0
          ? projects.reduce((acc, project) => {
              return acc + (project.budget ?? 0);
            }, 0)
          : 0;

      const analytics = [
        {
          title: "โครงการทั้งหมด",
          total: projectCount.toLocaleString().padStart(2, "0"),
          href: "/dashboard/projects",
          icon: LayoutGrid,
        },
        {
          title: "งบประมานทั้งหมด",
          total: totalRevenue.toLocaleString().padStart(2, "0"),
          href: "/dashboard/projects",
          icon: Banknote,
        },
        {
          title: "ลูกค้าทั้งหมด",
          total: clientCount.toLocaleString().padStart(2, "0"),
          href: "/dashboard/clients",
          icon: UsersRound,
        },
        {
          title: "สมาชิกทั้งหมด",
          total: guestProjectCount.toLocaleString(),
          href: "/dashboard/members",
          icon: User2,
        },
      ];

      return analytics;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
