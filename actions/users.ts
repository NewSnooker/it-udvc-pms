"use server";

import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
export async function createUser(data: UserProps) {
  const {
    email,
    password,
    firstName,
    lastName,
    name,
    phone,
    image,
    role,
    location,
    userId,
    companyName,
    companyDescription,
  } = data;
  try {
    // Hash the PAASWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return {
        error: `มีอีเมลนี้ในระบบแล้ว`,
        status: 409,
        data: null,
      };
    }
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        plain: role === UserRole.CLIENT ? password : "",
        firstName,
        lastName,
        name,
        phone,
        image,
        role,
        location,
        userId,
        companyName,
        companyDescription,
      },
    });
    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/users");
    // console.log(newUser);
    return {
      error: null,
      status: 200,
      data: newUser,
    };
  } catch (error) {
    console.log(error);
    return {
      error: `เกิดข้อผิดพลาดในการสร้างผู้ใช้`,
      status: 500,
      data: null,
    };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function updateUserById(id: string, data: UserProps) {
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/clients");
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteUser(id: string) {
  try {
    const deletedUser = await db.user.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deletedUser,
    };
  } catch (error) {
    console.log(error);
  }
}
export async function getKitUsers() {
  const endpoint = process.env.KIT_API_ENDPOINT as string;
  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 0 }, // Revalidate immediately
    });
    const response = await res.json();
    const count = response.count;
    return count;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงจํานวนผู้ใช้:", error);
    return 0;
  }
}
