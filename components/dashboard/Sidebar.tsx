"use client";
import React from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  AlignHorizontalJustifyEnd,
  Bell,
  CircleUser,
  Combine,
  DollarSign,
  ExternalLink,
  Handshake,
  Home,
  LayoutGrid,
  LineChart,
  Lock,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  User2,
  Users,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { WEBSITE_NAME } from "@/constants";
export default function Sidebar() {
  const sidebarLinks = [
    {
      title: "แดชบอร์ด",
      link: [
        {
          title: "ภาพรวม",
          href: "/dashboard",
          icon: Home,
        },
      ],
    },
    {
      title: "ลูกค้าและโครงการ",
      link: [
        {
          title: "ลูกค้า",
          href: "/dashboard/clients",
          icon: Users,
        },

        {
          title: "โครงการ",
          href: "/dashboard/projects",
          icon: LayoutGrid,
          // count: 2,
        },
        {
          title: "โครงการที่ได้เข้าร่วม",
          href: "/dashboard/guest-projects",
          icon: Combine,
          // count: 2,
        },
      ],
    },
    {
      title: "ทีมงาน",
      link: [
        {
          title: "สมาชิกโครงการ",
          href: "/dashboard/members",
          icon: User2,
        },
      ],
    },
    {
      title: "การเงิน",
      link: [
        {
          title: "การชำระเงิน",
          href: "/dashboard/payments",
          icon: Handshake,
        },
      ],
    },

    {
      title: "การติดต่อ",
      link: [
        {
          title: "อีเมล",
          href: "/dashboard/emails",
          icon: User2,
        },
        // {
        //   title: "อีเมล",
        //   href: "/dashboard/bulk-emails",
        //   icon: Lock,
        // },
      ],
    },
    {
      title: "ผลงาน",
      link: [
        {
          title: "ผลงาน",
          href: "/dashboard/portfolio",
          icon: User2,
        },
      ],
    },
    {
      title: "แบรนด์",
      link: [
        {
          title: "ตั้งค่าแบรนด์",
          href: "/dashboard/brand-settings",
          icon: User2,
        },
        {
          title: "ตัวจัดการไฟล์",
          href: "/dashboard/file-manager",
          icon: User2,
        },
      ],
    },
    {
      title: "รายงาน",
      link: [
        {
          title: "ความคืบหน้าของโครงการ",
          href: "/dashboard/project-progress",
          icon: User2,
        },
        {
          title: "สรุปทางการเงิน",
          href: "/dashboard/financial-summary",
          icon: User2,
        },
        {
          title: "การติดตามเวลา",
          href: "/dashboard/time-tracking",
          icon: User2,
        },
      ],
    },
    {
      title: "ตั้งค่า",
      link: [
        {
          title: "เปลี่ยนรหัสผ่าน",
          href: "/dashboard/change-password",
          icon: Lock,
        },
        {
          title: "การแจ้งเตือน",
          href: "/dashboard/notifications",
          icon: User2,
        },
        {
          title: "บูรณาการ",
          href: "/dashboard/integrations",
          icon: User2,
        },
      ],
    },
  ];
  const pathname = usePathname();
  const router = useRouter();
  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <AlignHorizontalJustifyEnd className="h-6 w-6" />
            <span className="">{WEBSITE_NAME}</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <ScrollArea className="h-auto sm:h-[calc(100vh-10rem)] w-full p-4">
            <nav className="grid items-start px-2 text-sm space-y-2 font-medium lg:px-4">
              {sidebarLinks.map((item, i) => {
                return (
                  <div className="" key={i}>
                    <h2 className="pb-1 font-semibold">{item.title}</h2>
                    {item.link.map((item, i) => {
                      const Icon = item.icon;
                      const isActive = item.href === pathname;
                      return (
                        <Link
                          key={i}
                          href={item.href}
                          className="w-full
                        "
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            size="icon"
                            className="w-full flex justify-start gap-2 px-4 mb-1"
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                )}
              >
                <ExternalLink className="h-4 w-4" />
                เว็บไซต์
              </Link>
            </nav>
          </ScrollArea>
        </div>
        {/* <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div> */}
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <Button onClick={handleLogout} size="sm" className="w-full">
              ออกจากระบบ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
