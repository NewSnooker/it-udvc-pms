"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createGuestProject({
  membersId,
  ownerId,
  projectId,
}: {
  membersId: string[];
  ownerId: string;
  projectId: string;
}) {
  try {
    const promises = membersId.map((memberId) => {
      return db.guestProject.create({
        data: {
          guestId: memberId,
          ownerId,
          projectId,
        },
      });
    });

    await Promise.all(promises);

    revalidatePath("/dashboard/file-manager");
    revalidatePath("/dashboard/projects");
    return {
      status: 200,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "เกิดข้อผิดพลาดในการสร้างผู้ร่วมโครงการ",
    };
  }
}
export async function getUserGuestProjects(userId: string | undefined) {
  try {
    if (userId) {
      const projects = await db.guestProject.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          guestId: userId,
        },
        include: {
          guest: true,
          project: true,
          owner: true,
        },
      });
      const list = projects.map((project) => {
        return {
          id: project.id,
          projectName: project.project.name,
          projectImage: project.project.thumbnail ?? "",
          ownerName: project.owner.name,
          ownerImage: project.owner.image ?? "",
          guestName: project.guest.name,
          guestImage: project.guest.image ?? "",
          projectLink: `/project/${project.project.slug}`,
          guestEmail: project.guest.email,
          ownerEmail: project.owner.email,
          createdAt: project.createdAt,
        };
      });
      return list;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserMemberProjects(userId: string | undefined) {
  try {
    if (userId) {
      const projects = await db.guestProject.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ownerId: userId,
        },
        include: {
          guest: true,
          project: true,
          owner: true,
        },
      });

      const list = projects.map((project) => {
        return {
          id: project.id,
          projectName: project.project.name,
          projectImage: project.project.thumbnail ?? "",
          ownerName: project.owner.name,
          ownerImage: project.owner.image ?? "",
          guestName: project.guest.name,
          guestImage: project.guest.image ?? "",
          projectLink: `/project/${project.project.slug}`,
          guestEmail: project.guest.email,
          ownerEmail: project.owner.email,
          createdAt: project.createdAt,
        };
      });
      return list;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserMemberProjectsEmail(userId: string | undefined) {
  // หาอีเมลของผู้ร่วมโครงการ ที่เราเป็นเจ้าของ
  try {
    if (userId) {
      const projects = await db.guestProject.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ownerId: userId,
        },
        include: {
          guest: true,
        },
      });

      const list = projects.map((project) => {
        return {
          email: project.guest.email,
        };
      });
      return list;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserGuestProjectsEmail(userId: string | undefined) {
  // หาอีเมลของผู้ร่วมโครงการ ที่เราเป็นสมาชิก
  try {
    if (userId) {
      const projects = await db.guestProject.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          guestId: userId,
        },
        include: {
          owner: true,
        },
      });

      const list = projects.map((project) => {
        return {
          email: project.owner.email,
        };
      });
      return list;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getProjectAndGuestByPaymentId(id: string) {
  try {
    const paymentResult = await db.payment.findUnique({
      where: {
        id,
      },
    });

    if (!paymentResult) {
      console.log("payment not found");

      return null;
    }
    const project = await db.project.findUnique({
      where: {
        id: paymentResult.projectId,
      },
      include: {
        guestProject: true,
      },
    });

    if (!project) {
      console.log("project not found");
      return null;
    }

    return project;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getProjectAndGuestByModuleId(id: string) {
  try {
    const moduleResult = await db.module.findUnique({
      where: {
        id,
      },
    });

    if (!moduleResult) {
      console.log("module not found");

      return null;
    }
    const project = await db.project.findUnique({
      where: {
        id: moduleResult.projectId,
      },
      include: {
        guestProject: true,
      },
    });

    if (!project) {
      console.log("project not found");
      return null;
    }

    return project;
  } catch (error) {
    console.log(error);
    return null;
  }
}
