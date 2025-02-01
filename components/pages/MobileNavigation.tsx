"use client";
import React, { useCallback, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  AlignHorizontalJustifyEnd,
  Menu,
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
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { WEBSITE_NAME } from "@/constants";

// นำ sidebarLinks มาใช้จาก Sidebar component
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
      {
        title: "โครงการที่ได้เข้าร่วม",
        href: "/dashboard/guest-projects",
        icon: Combine,
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
        title: "ผู้ติดตาม",
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
interface MobileNavButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
  isLoading: boolean;
}

// NavButton component สำหรับมือถือ
const MobileNavButton = React.memo(
  ({
    icon: Icon,
    title,
    href,
    isActive,
    onClick,
    isLoading,
  }: MobileNavButtonProps) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      className="w-full flex justify-start gap-2 px-4 mb-1"
      onClick={onClick}
      disabled={isLoading}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{title}</span>
    </Button>
  )
);

MobileNavButton.displayName = "MobileNavButton";

export default function MobileNavigation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }, [router]);

  const handleNavigation = useCallback(
    (href = "/dashboard") => {
      setIsLoading(true);
      try {
        router.push(href);
        setIsOpen(false); // ปิด Sheet หลังจากกดเลือกเมนู
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">เปิดเมนู</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex items-center border-b p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
              onClick={() => handleNavigation("/dashboard")}
            >
              <AlignHorizontalJustifyEnd className="h-6 w-6" />
              <span>{WEBSITE_NAME}</span>
            </Link>
          </div>
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="flex flex-col h-full p-4">
              <nav className="flex-1 space-y-4">
                {sidebarLinks.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h2 className="text-sm font-semibold px-4">
                      {section.title}
                    </h2>
                    {section.link.map((link, linkIdx) => (
                      <MobileNavButton
                        key={linkIdx}
                        icon={link.icon}
                        title={link.title}
                        href={link.href}
                        isActive={pathname === link.href}
                        onClick={() => handleNavigation(link.href)}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                ))}
                <MobileNavButton
                  icon={ExternalLink}
                  title="หน้าหลัก"
                  href="/"
                  isActive={false}
                  onClick={() => handleNavigation("/")}
                  isLoading={isLoading}
                />
                <div className="mt-auto p-4">
                  <Card>
                    <Button onClick={handleLogout} size="sm" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      ออกจากระบบ
                    </Button>
                  </Card>
                </div>
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
