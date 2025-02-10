"use server";

import { FolderWithRelations } from "@/components/dashboard/FileManagerPage";
import { maxDepthFolder } from "@/constants";
import { db } from "@/prisma/db";
import { FileProps, FolderProps } from "@/types/types";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
// Create default folder
export async function createDefaultFolderForUser(userId: string) {
  try {
    const existingFolder = await db.folder.findFirst({
      where: {
        name: "Root",
        userId: userId,
      },
    });
    if (existingFolder) {
      console.log("Root folder already exists for user:", userId);
      return;
    }

    const rootFolder = await db.folder.create({
      data: {
        name: "Root",
        userId: userId,
      },
    });
    console.log("Root folder created for user:", userId);

    const documentsFolder = await db.folder.create({
      data: {
        name: "Documents",
        userId: rootFolder.userId,
        parentFolderId: rootFolder.id,
      },
    });
    console.log("Documents folder created under Root folder");

    const ProjectsFolder = await db.folder.create({
      data: {
        name: "Projects",
        userId: rootFolder.userId,
        parentFolderId: rootFolder.id,
      },
    });

    console.log("Projects folder created under Root folder");
    revalidatePath("/dashboard/file-manager");

    return;
  } catch (error) {
    console.log(error);
    return;
  }
}
export async function createProjectFolderAtomatically(data: {
  userId: string;
  name: string;
}) {
  try {
    const rootProject = await db.folder.findFirst({
      where: {
        userId: data.userId,
        name: "Projects",
      },
    });
    if (rootProject) {
      await db.folder.create({
        data: {
          name: data.name,
          userId: data.userId,
          parentFolderId: rootProject.id,
        },
      });
      revalidatePath("/dashboard/file-manager");
      return;
    } else {
      console.log("folder not found  creating folder");
      return;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
async function getSubFolders(folderId: string) {
  const folder = await db.folder.findUnique({
    where: { id: folderId },
    include: {
      subFolders: true,
      files: true,
    },
  });

  if (!folder) return null;

  // โหลด subfolders แบบ recursive
  folder.subFolders = await Promise.all(
    folder.subFolders.map(async (subFolder) => {
      const nestedSubFolder = await getSubFolders(subFolder.id); // เรียกซ้ำ
      return nestedSubFolder || subFolder;
    })
  );

  return folder;
}
export async function getUserFolders(userId: string | undefined) {
  try {
    const folders = await db.folder.findMany({
      where: {
        userId,
        name: "Root",
      },
      include: {
        files: true,
      },
    });
    const foldersWithSubFolders = await Promise.all(
      folders.map(async (folder) => {
        return getSubFolders(folder.id);
      })
    );

    return foldersWithSubFolders as FolderWithRelations[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
async function getFolderDepth(folderId: string | null): Promise<number> {
  let depth = 0; // ตัวแปรที่ใช้เก็บระดับความลึก
  let currentFolderId = folderId;

  while (currentFolderId) {
    // ใช้ลูป while เพื่อเดินทางย้อนจากโฟลเดอร์ปัจจุบันไปยัง Root
    const folder = await db.folder.findUnique({
      where: { id: currentFolderId },
      select: { parentFolderId: true }, // ดึงแค่ `parentFolderId` เพื่อไปหาว่าโฟลเดอร์นี้มีพ่อแม่อยู่ที่ไหน
    });

    if (!folder) break; // ถ้าไม่พบโฟลเดอร์ ให้หยุดลูป

    depth++; // เพิ่มความลึกทุกครั้งที่เจอโฟลเดอร์ที่มีพ่อแม่
    currentFolderId = folder.parentFolderId; // เลื่อนไปยัง `parentFolderId` ของโฟลเดอร์ปัจจุบัน
  }

  return depth;
}
export async function createFolder(data: FolderProps) {
  try {
    // ตรวจสอบความลึกของโฟลเดอร์ก่อนสร้าง
    const depth = await getFolderDepth(data.parentFolderId ?? "");

    if (depth >= maxDepthFolder) {
      return {
        ok: false,
        folder: null,
        error: `ไม่สามารถสร้างโฟลเดอร์ได้เกิน ${maxDepthFolder} ชั้น`,
      };
    }

    // สร้างโฟลเดอร์ใหม่
    const folder = await db.folder.create({
      data: {
        name: data.name,
        userId: data.userId,
        parentFolderId: data.parentFolderId,
      },
    });

    revalidatePath("/dashboard/file-manager");
    return {
      ok: true,
      folder,
      error: null,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateFolderById(id: string, data: FolderProps) {
  try {
    const updatedFolder = await db.folder.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
    console.log(updatedFolder);

    revalidatePath("/dashboard/file-manager");
    return updatedFolder;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteFolderCascadeTransaction(folderId: string) {
  try {
    await db.$transaction(async (tx) => {
      async function deleteFolderRecursive(id: string) {
        const folder = await tx.folder.findUnique({
          where: { id },
          include: {
            subFolders: true,
            files: {
              select: {
                id: true,
                key: true, // เพิ่ม key เพื่อใช้ลบไฟล์จาก Uploadthing
              },
            },
          },
        });

        if (!folder) {
          throw new Error("Folder not found");
        }

        // ลบไฟล์จาก Uploadthing ก่อน
        const utapi = new UTApi();
        for (const file of folder.files) {
          try {
            await utapi.deleteFiles(file.key);
          } catch (error) {
            console.error(
              `Error deleting file from Uploadthing (key: ${file.key}):`,
              error
            );
            // ทำการลบต่อไปแม้จะมี error เพื่อให้ข้อมูลใน DB สอดคล้องกัน
          }
        }

        // ลบไฟล์จาก Database
        await tx.file.deleteMany({ where: { parentFolderId: id } });

        // ลบ subFolders แบบ recursive
        for (const subFolder of folder.subFolders) {
          await deleteFolderRecursive(subFolder.id);
        }

        // ลบโฟลเดอร์
        await tx.folder.delete({ where: { id } });
      }

      await deleteFolderRecursive(folderId);
    });

    revalidatePath("/dashboard/file-manager");
    console.log("Folder and all contents deleted successfully");

    return { ok: true };
  } catch (error) {
    console.error("Error deleting folder cascade:", error);
    return { ok: false, error: (error as Error).message };
  }
}
export async function createMultipleFile(data: FileProps[]) {
  try {
    const createdFiles = await db.file.createMany({ data: data });
    revalidatePath("/dashboard/file-manager");
    return createdFiles;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function deleteFile(id: string, key: string) {
  try {
    const deletedFile = await db.file.delete({
      where: {
        id,
      },
    });
    const utapi = new UTApi();
    await utapi.deleteFiles(key);
    revalidatePath("/dashboard/file-manager");
    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return { ok: false, error: (error as Error).message };
  }
}
export async function deleteFileUploadthing(key: string) {
  try {
    const utapi = new UTApi();
    await utapi.deleteFiles(key);
  } catch (error) {
    console.error("UTAPI: Error deleting files", error);
  }
}
