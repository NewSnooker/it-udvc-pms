import React from "react";

import { Session } from "next-auth";
import { ModeToggle } from "../mode-toggle";
import { AvatarMenuButton } from "./AvatarMenuButton";
import MobileNavigation from "../pages/MobileNavigation";
export default function Navbar({ session }: { session: Session }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between sm:justify-end">
      <MobileNavigation />
      <div className="flex gap-2 sm:gap-4">
        <ModeToggle />
        <AvatarMenuButton session={session} />
      </div>
    </header>
  );
}
