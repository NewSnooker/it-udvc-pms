import { getUserFolders } from "@/actions/fileManager";
import {
  FileManagerPage,
  FolderWithRelations,
} from "@/components/dashboard/FileManagerPage";
import { getAuthUser } from "@/config/getAuthUser";
import React from "react";
export const metadata = {
  title: "จัดการไฟล์",
};
export default async function page() {
  const user = await getAuthUser();
  const userFolders: FolderWithRelations[] = await getUserFolders(user?.id);
  if (!userFolders) {
    return <div>No folders found</div>;
  }
  return (
    <div className="h-auto sm:h-[calc(100vh-11rem)]">
      <FileManagerPage userFolders={userFolders} userId={user?.id ?? ""} />
    </div>
  );
}
