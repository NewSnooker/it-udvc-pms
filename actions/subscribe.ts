"use server";

import { SubscribeFormProps } from "@/components/Forms/SubscribeForm";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createSubscription(data: SubscribeFormProps) {
  const userId = data.userId;
  if (userId) {
    try {
      const subscriber = await db.subscriber.create({
        data,
      });
      revalidatePath("/dashboard/subscribers");
      return subscriber;
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
