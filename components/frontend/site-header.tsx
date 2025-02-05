"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/generateInitials";
import Logo from "@/components/global/Logo";
import AuthenticatedAvatar from "@/components/global/AuthenticatedAvatar";
import { WEBSITE_NAME } from "@/constants";
import { getUserById } from "@/actions/users";

export default function SiteHeader({ session }: { session: Session | null }) {
  const navigation = [
    { name: "หน้าหลัก", href: "/" },
    { name: "เกี่ยวกับ", href: "/#about" },
    { name: "วิธีใช้งาน", href: "/#docs" },
    { name: "ติดต่อ", href: "/#contact" },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="sticky inset-x-0 top-0 z-50 ">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 lg:px-8 backdrop-blur  "
      >
        <div className="flex lg:flex-1">
          <Logo title={WEBSITE_NAME} href="/" />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-700 hover:text-zinc-900 dark:text-zinc-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              scroll
              className="text-sm font-semibold leading-6 "
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-2">
          <ModeToggle />
          {session ? (
            <AuthenticatedAvatar session={session} />
          ) : (
            <Button asChild variant={"outline"}>
              <Link href="/login">เข้าสู่ระบบ</Link>
            </Button>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-background overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Logo title={WEBSITE_NAME} href="/" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 "
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y ">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 "
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {session ? (
                  <AuthenticatedAvatar session={session} />
                ) : (
                  <Button asChild variant={"outline"}>
                    <Link href="/login">เข้าสู่ระบบ</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
