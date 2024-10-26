"use server";

import { db } from "@/prisma/db";
import { ProjectData, ProjectProps } from "@/types/types";
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
        error: `มีชื่อโครงการ "${data.name}" ในระบบแล้ว`,
        data: null,
      };
    }
    if (!data.userId) {
      return {
        status: 404,
        error: "ไม่พบไอดีผู้ใช้",
        data: null,
      };
    }
    const newProject = await db.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        thumbnail: data.thumbnail,
        startDate: data.startDate,
        endDate: data.endDate,
        clientId: data.clientId,
        userId: data.userId,
        deadline: data.deadline,
        budget: data.budget,
      },
    });
    // console.log(newProject);
    revalidatePath("/dashboard/projects");
    return {
      status: 200,
      data: newProject,
      error: null,
    };
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
export async function getRecentProjects(userId: string | undefined) {
  try {
    if (userId) {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
        take: 5,
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
      data,
    });
    revalidatePath("/dashboard/projects");
    return updatedProject;
  } catch (error) {
    console.log(error);
  }
}
export async function getProjectById(id: string) {
  try {
    const project = await db.project.findUnique({
      where: {
        id,
      },
    });
    return project;
  } catch (error) {
    console.log(error);
  }
}
export async function getProjectDetailBySlug(
  slug: string
): Promise<ProjectData | null> {
  try {
    const project = await db.project.findUnique({
      where: { slug },
      include: {
        modules: true,
        members: true,
        invoices: true,
        comments: true,
        payments: true,
      },
    });

    if (!project) {
      return null;
    }

    const client = await db.user.findFirst({
      where: {
        id: project.clientId,
        role: "CLIENT",
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        image: true,
        location: true,
        role: true,
        companyName: true,
        companyDescription: true,
      },
    });

    if (!client) {
      throw new Error("ไม่พบลูกค้า");
    }

    return {
      ...project,
      client,
    };
  } catch (error) {
    console.log(error);
    return null;
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
