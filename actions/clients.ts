"use server";

import { db } from "@/prisma/db";
import { UserRole } from "@prisma/client";

export async function getUserClient(userId: string | undefined) {
  try {
    if (userId) {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          role: UserRole.CLIENT,
          userId,
        },
      });

      return users;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserRecentClient(userId: string | undefined) {
  try {
    if (userId) {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          role: UserRole.CLIENT,
          userId,
        },
        take: 5,
      });

      return users;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
