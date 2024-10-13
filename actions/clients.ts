"use server";

import { db } from "@/prisma/db";

export async function getAllClient() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "CLIENT",
      },
    });

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}
