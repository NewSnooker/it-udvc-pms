"use server";

import { SubscribeFormProps } from "@/components/Forms/SubscribeForm";
import { validateEmail } from "@/lib/validateEmail";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { sendNotificationToFollowed, sendThankYouSubscribe } from "./emails";

export async function createSubscription(data: SubscribeFormProps) {
  try {
    const { userId, email } = data;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return {
        error: "ไม่พบผู้ใช้คนนี้ในระบบ",
        ok: false,
        status: 404,
        data: null,
      };
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return {
        error: emailValidation.error,
        ok: false,
        status: 400,
        data: null,
      };
    }

    // ตรวจสอบอีเมลซ้ำ
    const existingEmail = await db.subscriber.findUnique({
      where: { userId_email: { userId, email } },
    });

    if (existingEmail) {
      return {
        error: `คุณได้ติดตาม ${user.name} แล้ว`,
        ok: false,
        status: 409,
        data: null,
      };
    }

    const subscriber = await db.subscriber.create({ data });
    await sendNotificationToFollowed({ user, email });
    await sendThankYouSubscribe({ user, email });

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
