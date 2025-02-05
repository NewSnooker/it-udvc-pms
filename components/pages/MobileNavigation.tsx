"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Menu, ExternalLink, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { WEBSITE_NAME } from "@/constants";
import { Session } from "next-auth";
import { getSidebarLinkByRole } from "@/lib/getSidebarLinkByRole";
import Logo from "@/components/global/Logo";

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

export default function MobileNavigation({ session }: { session: Session }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const sidebarLinks = getSidebarLinkByRole(session?.user?.role);
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
            <Logo title={WEBSITE_NAME} href="/dashboard" />
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
