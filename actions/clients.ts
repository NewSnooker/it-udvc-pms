"use server";

import { db } from "@/prisma/db";

export async function getUserClient(userId: string | undefined) {
  try {
    if (userId) {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          role: "CLIENT",
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
          role: "CLIENT",
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
