"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WEBSITE_NAME } from "@/constants";
import { getInitials } from "@/lib/generateInitials";
import { LogOut, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagicCard } from "@/components/ui/magic-card";
import { getUserById } from "@/actions/users";
import { useEffect, useState } from "react";

export function AvatarMenuButton({ session }: { session: Session }) {
  const [user, setMe] = useState(session.user);
  useEffect(() => {
    const handleUser = async () => {
      const me = await getUserById(session.user.id);
      setMe(me);
    };
    handleUser();
  }, [session.user.id]);
  const initials = getInitials(user.name);
  const router = useRouter();
  const { theme } = useTheme();
  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer">
          <Avatar>
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between sm:justify-start space-x-3 pb-3 border-b">
            <Avatar>
              <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h2 className="scroll-m-20 text-sm sm:text-xl font-semibold ">
                {user.name}
              </h2>
              <p className=" text-muted-foreground text-xs sm:text-sm">
                {user.email}
              </p>
            </div>
          </div>
        </SheetHeader>
        <SheetClose className="w-full mt-2" asChild>
          <Button asChild variant={"outline"} className="w-full">
            <Link href="/dashboard/account">
              <User className="h-4 w-4 mr-2" />
              <span>แก้ไขบัญชีผู้ใช้</span>
            </Link>
          </Button>
        </SheetClose>
        <MagicCard
          className="cursor-pointer grid gap-4 mt-2 mb-6 p-4 sm:p-6 border-b h-fit shadow-2xl"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <h2 className="text-sm sm:text-lg font-bold">{WEBSITE_NAME}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            โครงการพัฒนาเว็บไซต์ที่เกิดขึ้นจากความมุ่งมั่นและความคิดสร้างสรรค์ของนักศึกษาวิทยาลัยอาชีวศึกษาอุดรธานี
            (UDVC) ประจำปีการศึกษา 2568
          </p>
          <h3 className=" text-sm sm:text-lg font-semibold mt-4">
            เป้าหมายของโครงการ
          </h3>
          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground">
            <li>พัฒนาทักษะการเขียนโปรแกรมและการพัฒนาเว็บไซต์ของนักศึกษา</li>
            <li>ส่งเสริมการทำงานเป็นทีมและการจัดการโครงการในรูปแบบมืออาชีพ</li>
          </ul>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            ด้วยความภาคภูมิใจ, นักศึกษาวิทยาลัยอาชีวศึกษาอุดรธานี ปีการศึกษา
            2568
          </p>
        </MagicCard>
        <SheetFooter>
          <Button onClick={handleLogout} className="w-full" variant={"default"}>
            <LogOut className="h-4 w-4 mr-2" />
            <span>ออกจากระบบ</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
