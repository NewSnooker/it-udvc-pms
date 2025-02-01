import { sidebarLinksAdmin, sidebarLinksClient } from "@/constants";
import { UserRole } from "@prisma/client";

export const getSidebarLinkByRole = (role: string) => {
  return role === UserRole.CLIENT ? sidebarLinksClient : sidebarLinksAdmin;
};
