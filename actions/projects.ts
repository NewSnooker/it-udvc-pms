"use server";

import { db } from "@/prisma/db";
import { ProjectData, ProjectProps, ProjectWithPayments } from "@/types/types";
import { revalidatePath } from "next/cache";
import { createProjectFolderAtomatically } from "./fileManager";
import { UserRole } from "@prisma/client";

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
    // create project folder
    await createProjectFolderAtomatically({
      userId: data.userId,
      name: data.name,
    });
    revalidatePath("/dashboard/file-manager");
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
export async function getUserProjectsCount(userId: string | undefined) {
  try {
    if (userId) {
      const projectsCount = await db.project.count({
        where: {
          userId,
          isPublic: true,
        },
      });

      return projectsCount;
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
        take: 3,
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
export async function getUserPublicProjects(userId: string | undefined) {
  try {
    if (userId) {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
          isPublic: true,
        },
        include: {
          user: true,
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
export async function getDetailUserProjects(userId: string | undefined) {
  try {
    if (userId) {
      const projects = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          thumbnail: true,
          payments: true,
        },
      });

      return projects as ProjectWithPayments[];
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
export async function updateNameProjectById(id: string, name: string) {
  try {
    const updatedProject = await db.project.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    revalidatePath("/dashboard/projects");
    return updatedProject;
  } catch (error) {
    console.log(error);
  }
}
export async function updateProjectPublicityById(
  id: string,
  isPublic: boolean
) {
  try {
    const updatedProject = await db.project.update({
      where: {
        id,
      },
      data: {
        isPublic,
      },
    });
    revalidatePath("/dashboard/projects");
    revalidatePath("/portfolio/[slug]", "page");
    return { data: updatedProject, ok: true };
  } catch (error) {
    console.log(error);
    return { data: null, ok: false };
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
        invoices: true,
        comments: true,
        payments: true,
        guestProject: true,
        user: true,
      },
    });

    if (!project) {
      return null;
    }

    const client = await db.user.findFirst({
      where: {
        id: project.clientId,
        role: UserRole.CLIENT,
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
        plain: true,
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
