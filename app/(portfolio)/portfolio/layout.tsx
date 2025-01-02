import PublicNavbar from "@/components/PublicNavbar";
import React, { ReactNode } from "react";
export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <PublicNavbar />
      {children}
    </div>
  );
}
