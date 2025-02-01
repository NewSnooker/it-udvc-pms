import { getUserFolders } from "@/actions/fileManager";
import {
  FileManagerPage,
  FolderWithRelations,
} from "@/components/dashboard/FileManagerPage";
import { UTApi } from "uploadthing/server";
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
  const utapi = new UTApi();
  const usageInfo = await utapi.getUsageInfo();
  const totalBytes = usageInfo.totalBytes;
  const limitBytes = usageInfo.limitBytes;
  return (
    <div className="h-auto sm:h-[calc(100vh-11rem)]">
      <FileManagerPage
        userFolders={userFolders}
        userId={user?.id ?? ""}
        totalBytes={totalBytes}
        limitBytes={limitBytes}
      />
    </div>
  );
}
