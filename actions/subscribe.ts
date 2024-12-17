"use server";

import { SubscribeFormProps } from "@/components/Forms/SubscribeForm";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createSubscription(data: SubscribeFormProps) {
  const userId = data.userId;

  if (userId) {
    try {
      const existingEmail = await db.subscriber.findUnique({
        where: {
          email: data.email,
        },
      });
      if (existingEmail) {
        return {
          error: `มีอีเมลนี้ในระบบแล้ว`,
          ok: false,
          status: 409,
        };
      }
      const subscriber = await db.subscriber.create({
        data,
      });
      revalidatePath("/dashboard/subscribers");
      return {
        data: subscriber,
        ok: true,
        error: null,
        status: 201,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export async function getUserSubscribersByUserId(userId: string) {
  try {
    const data = await db.subscriber.findMany({
      where: {
        userId,
      },
    });
    revalidatePath("/dashboard/subscribers");
    return data;
  } catch (error) {
    console.log(error);
  }
}
