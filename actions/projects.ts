"use server";

import { db } from "@/prisma/db";
import { ProjectProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createProject(data: ProjectProps) {
  const slug = data.slug;
  try {
    const existingProject = await db.project.findUnique({
      where: {
        slug,
      },
    });
    if (existingProject) {
      return {
        status: 409,
        error: `มีชื่อโครงการ ${data.name} ในระบบแล้ว`,
      };
    }
    if (!data.userId) {
      return {
        status: 404,
        error: "ไม่พบไอดีผู้ใช้",
      };
    }
    const newProject = await db.project.create({
      data: {
        name: data.name,
        description: data.description,
        slug: data.slug,
        thumbnail: data.thumbnail,
        startDate: data.startDate,
        clientId: data.clientId,
        userId: data.userId,
      },
    });
    // console.log(newProject);
    revalidatePath("/dashboard/projects");
    return newProject;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserProjects(userId: string | undefined) {
  try {
    if (userId) {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
      });

      return projects;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updateProjectById(id: string, data: ProjectProps) {
  try {
    const updatedProject = await db.project.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        slug: data.slug,
        thumbnail: data.thumbnail,
        startDate: data.startDate,
        clientId: data.clientId,
      },
    });
    revalidatePath("/dashboard/projects");
    return updatedProject;
  } catch (error) {
    console.log(error);
  }
}
export async function getProjectById(id: string) {
  try {
    const Project = await db.project.findUnique({
      where: {
        id,
      },
    });
    return Project;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteProject(id: string) {
  try {
    const deletedProject = await db.project.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deletedProject,
    };
  } catch (error) {
    console.log(error);
  }
}
