"use server";

import { db } from "@/prisma/db";
import { ModuleProps } from "@/types/types";
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
