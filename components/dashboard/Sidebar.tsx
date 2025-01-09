"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  AlignHorizontalJustifyEnd,
  Bell,
  Building2,
  Combine,
  ExternalLink,
  FolderOpen,
  Folders,
  Handshake,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  User2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { WEBSITE_NAME } from "@/constants";
export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
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
          icon: Mail,
        },
        {
          title: "อีเมลผู้ติดตาม",
          href: "/dashboard/subscribers",
          icon: Mail,
        },
      ],
    },
    {
      title: "แฟ้มสะสมผลงาน",
      link: [
        {
          title: "Portfolio",
          href: "/dashboard/portfolio",
          icon: FolderOpen,
        },
      ],
    },
    {
      title: "บริษัท",
      link: [
        {
          title: "ตั้งค่าบริษัท",
          href: "/dashboard/brand-settings",
          icon: Building2,
        },
        {
          title: "จัดการไฟล์",
          href: "/dashboard/file-manager",
          icon: Folders,
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
      ],
    },
  ];

  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  function handleNavigation(href: string) {
    setIsLoading(true);
    try {
      router.push(href); // ดำเนินการนำทาง
    } catch (err) {
      console.error(err); // จัดการข้อผิดพลาด
    } finally {
      setIsLoading(false); // เปลี่ยนสถานะกลับ
    }
  }
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <ScrollArea className="h-auto sm:h-[calc(100vh-10rem)] w-full p-4">
            <nav className="grid items-start px-2 text-sm space-y-2 font-medium lg:px-4">
              {sidebarLinks.map((item, i) => (
                <div key={i}>
                  <h2 className="pb-1 font-semibold">{item.title}</h2>
                  {item.link.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = link.href === pathname;
                    return (
                      <Button
                        key={index}
                        variant={isActive ? "default" : "ghost"}
                        size="icon"
                        className="w-full flex justify-start gap-2 px-4 mb-1"
                        onClick={() => handleNavigation(link.href)}
                        disabled={isLoading}
                      >
                        <Icon className="h-4 w-4" />
                        {link.title}
                      </Button>
                    );
                  })}
                </div>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="w-full flex justify-start gap-2 px-4 mb-1"
                onClick={() => handleNavigation("/")}
                disabled={isLoading}
              >
                <ExternalLink className="h-4 w-4" />
                เว็บไซต์
              </Button>
            </nav>
          </ScrollArea>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <Button onClick={handleLogout} size="sm" className="w-full">
              ออกจากระบบ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
