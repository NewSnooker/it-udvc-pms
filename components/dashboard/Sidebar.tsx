"use client";
import React, { useMemo, useCallback, useState } from "react";
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
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { WEBSITE_NAME } from "@/constants";
import Link from "next/link";

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
      {
        title: "โครงการที่ได้เข้าร่วม",
        href: "/dashboard/guest-projects",
        icon: Combine,
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

// แยก NavButton ออกมาเป็น component แยกเพื่อลดการ re-render
interface NavButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
  isLoading: boolean;
}

const NavButton = React.memo(
  ({
    icon: Icon,
    title,
    href,
    isActive,
    onClick,
    isLoading,
  }: NavButtonProps) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="icon"
      className="w-full flex justify-start gap-2 px-4 mb-1"
      onClick={onClick}
      disabled={isLoading}
    >
      <Icon className="h-4 w-4" />
      {title}
    </Button>
  )
);

// Assign the displayName to the component explicitly
NavButton.displayName = "NavButton";

export default function Sidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Prefetch all routes when component mounts
  React.useEffect(() => {
    sidebarLinks.forEach((section) => {
      section.link.forEach((link) => {
        router.prefetch(link.href);
      });
    });
    router.prefetch("/"); // Prefetch homepage as well
  }, [router]);

  // Memoize handleLogout to prevent recreating on every render
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }, [router]);

  // Memoize handleNavigation
  const handleNavigation = useCallback(
    (href = "/dashboard") => {
      setIsLoading(true);
      try {
        router.push(href);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Memoize the entire navigation section
  const navigationSection = useMemo(
    () => (
      <nav className="grid items-start px-2 text-sm space-y-2 font-medium lg:px-4">
        <div className="flex items-center border-b pb-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <AlignHorizontalJustifyEnd className="h-6 w-6" />
            <span className="">{WEBSITE_NAME}</span>
          </Link>
        </div>
        {sidebarLinks.map((item, i) => (
          <div key={i}>
            <h2 className="pb-1 font-semibold">{item.title}</h2>
            {item.link.map((link, index) => (
              <NavButton
                key={index}
                icon={link.icon}
                title={link.title}
                href={link.href}
                isActive={link.href === pathname}
                onClick={() => handleNavigation(link.href)}
                isLoading={isLoading}
              />
            ))}
          </div>
        ))}
        <NavButton
          icon={ExternalLink}
          title="เว็บไซต์"
          href="/"
          isActive={false}
          onClick={() => handleNavigation("/")}
          isLoading={isLoading}
        />
      </nav>
    ),
    [pathname, handleNavigation, isLoading]
  );

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <ScrollArea className="h-auto sm:h-[calc(100vh-10rem)] w-full p-4">
            {navigationSection}
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
