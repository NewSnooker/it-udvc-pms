"use server";

import { db } from "@/prisma/db";
import { TasksProps } from "@/types/types";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTask(data: TasksProps) {
  try {
    const newTasks = await db.task.create({
      data,
    });
    revalidatePath("/dashboard/projects");
    revalidatePath("/(project)/project/modules/[id]", "page");
    return newTasks;
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
export async function updateTaskById(id: string, data: TasksProps) {
  try {
    const updatedTask = await db.task.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/projects");
    revalidatePath("/(project)/project/modules/[id]", "page");
    return updatedTask;
  } catch (error) {
    console.log(error);
  }
}
export async function updateTaskStatus(id: string, status: TaskStatus) {
  try {
    const updatedTask = await db.task.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    revalidatePath("/dashboard/projects");
    return updatedTask;
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
export async function deleteTask(id: string) {
  try {
    const deletedTask = await db.task.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/projects");

    return {
      ok: true,
      data: deletedTask,
    };
  } catch (error) {
    console.log(error);
  }
}
