"use server";

import { db } from "@/prisma/db";
import { ModuleProps } from "@/types/types";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createModule(data: ModuleProps) {
  try {
    const newModule = await db.module.create({
      data,
    });
    revalidatePath("/dashboard/projects");
    return newModule;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getProjectModules(projectId: string | undefined) {
  try {
    if (projectId) {
      const modules = await db.module.findMany({
        where: {
          projectId,
        },
        include: {
          tasks: true,
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return modules;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getPercentageCompletionByProjectId(
  projectId: string
): Promise<number> {
  try {
    // ดึงข้อมูล modules พร้อม tasks ทั้งหมดในโปรเจ็คนั้น
    const modules = await db.module.findMany({
      where: {
        projectId,
      },
      include: {
        tasks: true,
      },
    });

    // รวม tasks จากทุก modules
    const allTasks = modules.flatMap((module) => module.tasks);

    // นับจำนวน tasks ทั้งหมด
    const totalTasks = allTasks.length;

    // นับจำนวน tasks ที่เสร็จแล้ว (status = COMPLETE)
    const completedTasks = allTasks.filter(
      (task) => task.status === TaskStatus.COMPLETE
    ).length;

    // คำนวณเปอร์เซ็นต์
    // ถ้าไม่มี tasks เลย return 0
    // ปัดเศษให้เป็นจำนวนเต็ม
    const percentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return percentage;
  } catch (error) {
    console.error("Error calculating project completion percentage:", error);
    throw error; // ควร throw error ออกไปให้ caller จัดการ
  }
}
export async function updateModuleById(id: string, data: ModuleProps) {
  try {
    const updatedModule = await db.module.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/projects");
    return updatedModule;
  } catch (error) {
    console.log(error);
  }
}
export async function getModuleById(id: string) {
  try {
    const modules = await db.module.findUnique({
      where: {
        id,
      },
    });
    return modules;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteModule(id: string) {
  try {
    const deletedModule = await db.module.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/projects");

    return {
      ok: true,
      data: deletedModule,
    };
  } catch (error) {
    console.log(error);
  }
}
