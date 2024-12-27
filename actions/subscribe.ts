"use server";

import { SubscribeFormProps } from "@/components/Forms/SubscribeForm";
import { validateEmail } from "@/lib/validateEmail";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createSubscription(data: SubscribeFormProps) {
  const { userId, email } = data;

  if (userId) {
    // 1. ตรวจสอบอีเมล
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return {
        error: emailValidation.error,
        ok: false,
        status: 400,
        data: null,
      };
    }

    try {
      // 2. ตรวจสอบอีเมลซ้ำ
      const existingEmail = await db.subscriber.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        return {
          error: `มีอีเมลนี้ในระบบแล้ว`,
          ok: false,
          status: 409,
          data: null,
        };
      }

      // 3. สร้าง subscriber
      const subscriber = await db.subscriber.create({ data });
      revalidatePath("/dashboard/subscribers");
      return {
        data: subscriber,
        ok: true,
        error: null,
        status: 201,
      };
    } catch (error) {
      console.error("Subscription creation error:", error);
      return {
        error: error as string,
        ok: false,
        status: 500,
        data: null,
      };
    }
  }
  revalidatePath("/dashboard/subscribers");

  return {
    error: "ไม่พบข้อมูลผู้ใช้",
    ok: false,
    status: 400,
    data: null,
  };
}
export async function getUserSubscribersByUserId(userId: string) {
  try {
    const data = await db.subscriber.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    revalidatePath("/dashboard/subscribers");
    return data;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSubscribers(id: string) {
  try {
    const deletedSubscribers = await db.subscriber.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/subscribers");

    return {
      ok: true,
      data: null,
    };
  } catch (error) {
    console.log(error);
  }
}
