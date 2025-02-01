"use client";
import React, { useMemo, useCallback, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlignHorizontalJustifyEnd, ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { WEBSITE_NAME } from "@/constants";
import Link from "next/link";
import { Session } from "next-auth";
import { getSidebarLinkByRole } from "@/lib/getSidebarLinkByRole";

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

export default function Sidebar({ session }: { session: Session }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const sidebarLinks = getSidebarLinkByRole(session?.user?.role);

  // Prefetch all routes when component mounts
  React.useEffect(() => {
    sidebarLinks.forEach((section) => {
      section.link.forEach((link) => {
        router.prefetch(link.href);
      });
    });
    router.prefetch("/"); // Prefetch homepage as well
  }, [router, sidebarLinks]);

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
          title="หน้าหลัก"
          href="/"
          isActive={false}
          onClick={() => handleNavigation("/")}
          isLoading={isLoading}
        />
      </nav>
    ),
    [sidebarLinks, isLoading, pathname, handleNavigation]
  );

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <div className="flex items-center border-b p-4 pt-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <AlignHorizontalJustifyEnd className="h-6 w-6" />
              <span className="">{WEBSITE_NAME}</span>
            </Link>
          </div>
          <ScrollArea className="h-auto sm:h-[calc(100vh-10rem)] w-full p-4">
            {navigationSection}
          </ScrollArea>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <Button onClick={handleLogout} size="sm" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              ออกจากระบบ
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
