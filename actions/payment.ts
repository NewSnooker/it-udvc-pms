"use server";

import { db } from "@/prisma/db";
import { CategoryProps, InvoiceDetails, PaymentProps } from "@/types/types";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPayment(data: PaymentProps) {
  try {
    const payment = await db.payment.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/projects");
    return payment;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getInvoiceById(id: string) {
  try {
    const payment = await db.payment.findUnique({
      where: {
        id,
      },
    });

    if (!payment) return null;

    const client = await db.user.findUnique({
      where: {
        id: payment?.clientId,
        role: UserRole.CLIENT,
      },
      select: {
        name: true,
        phone: true,
        email: true,
        companyName: true,
        companyDescription: true,
      },
    });
    const user = await db.user.findUnique({
      where: {
        id: payment?.userId,
        role: UserRole.USER,
      },
      select: {
        name: true,
        phone: true,
        email: true,
        companyName: true,
        companyDescription: true,
        userLogo: true,
      },
    });
    return {
      invoice: payment,
      user,
      client,
    } as InvoiceDetails;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updatedPaymentById(id: string, data: PaymentProps) {
  try {
    const updatedPayment = await db.payment.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/projects");
    return updatedPayment;
  } catch (error) {
    console.log(error);
  }
}
export async function getPaymentById(id: string) {
  try {
    const payment = await db.payment.findUnique({
      where: {
        id,
      },
    });
    return payment;
  } catch (error) {
    console.log(error);
  }
}
export async function deletePayment(id: string) {
  try {
    const deletedPayment = await db.payment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/projects");
    return {
      ok: true,
      data: deletedPayment,
    };
  } catch (error) {
    console.log(error);
  }
}
