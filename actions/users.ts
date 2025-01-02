"use server";

import { PasswordProps } from "@/components/Forms/ChangPasswordForm";
import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { compare } from "bcrypt";
import { revalidatePath } from "next/cache";
import { createDefaultFolderForUser } from "./fileManager";
import { ResetPasswordProps } from "@/components/ResetPasswordForm";
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

    // Create default folder
    await createDefaultFolderForUser(newUser.id);

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/file-manager");
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
export async function getExistingUsers() {
  try {
    const users = await db.user.findMany({
      where: {
        role: UserRole.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return users;
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
export async function changeUserPasswordById(id: string, data: PasswordProps) {
  try {
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    // เช็คว่ามี user และ password หรือไม่
    if (!existingUser?.password) {
      return {
        error: "คุณไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาอ่านคําแนะนําที่หมายเหตุ",
        status: 404,
      };
    }
    const passwordMatch = existingUser?.password
      ? await compare(data.oldPassword, existingUser.password)
      : false;
    if (!passwordMatch) {
      return { error: "รหัสผ่านเดิมไม่ถูกต้อง", status: 403 };
    }
    if (data.oldPassword === data.newPassword) {
      return { error: "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม", status: 403 };
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
        plain: data.newPassword,
      },
    });
    revalidatePath("/dashboard/change-password");
    return { error: null, status: 200 };
  } catch (error) {
    console.log(error);
  }
}
export async function resetUserPasswordById(
  id: string,
  data: ResetPasswordProps
) {
  try {
    if (data.newPassword !== data.confirmPassword) {
      return { error: "รหัสผ่านไม่ตรงกัน", status: 403 };
    }
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    // เช็คว่ามี user และ password หรือไม่
    if (!existingUser?.password) {
      return {
        error: "คุณไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาอ่านคําแนะนําที่หมายเหตุ",
        status: 404,
      };
    }

    // เปรียบเทียบรหัสผ่านใหม่กับรหัสผ่านเดิม
    const passwordMatch = await compare(
      data.newPassword,
      existingUser.password
    );

    if (passwordMatch) {
      return { error: "รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม", status: 403 };
    }
    console.log(passwordMatch);

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
    revalidatePath("/dashboard/reset-password");
    console.log(hashedPassword);

    console.log(updatedUser);

    return { error: null, status: 200 };
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
