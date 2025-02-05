"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/generateInitials";
import { Session } from "next-auth";
import Link from "next/link";
import LogoutBtn from "@/components/global/LogoutBtn";
import { User, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { getUserById } from "@/actions/users";

export default function AuthenticatedAvatar({
  session,
}: {
  session: Session | null;
}) {
  const role = session?.user?.role;
  const [user, setMe] = useState(session?.user || null);
  useEffect(() => {
    if (session?.user?.id) {
      const handleUser = async () => {
        const me = await getUserById(session.user.id);
        setMe(me);
      };
      handleUser();
    }
  }, [session?.user?.id]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Avatar>
          <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <p>{user?.name}</p>
          <p className=" text-xs text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        {role === UserRole.USER && (
          <DropdownMenuItem>
            <Link href="/dashboard">แดชบอร์ด</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <LogoutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
