"use server";

import { db } from "@/prisma/db";
import { PortfolioProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createPortfolio(data: PortfolioProps) {
  try {
    const newPortfolio = await db.portfolioProfile.create({
      data,
    });
    revalidatePath("/dashboard/portfolio");
    revalidatePath("/(portfolio)/portfolio/[slug]", "page");
    return newPortfolio;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updatePortfolioById(id: string, data: PortfolioProps) {
  try {
    const updatedPortfolio = await db.portfolioProfile.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/portfolio");
    revalidatePath("/(portfolio)/portfolio/[slug]", "page");
    return updatedPortfolio;
  } catch (error) {
    console.log(error);
  }
}
export async function getPortfolioByUserId(userId: string) {
  try {
    const data = await db.portfolioProfile.findUnique({
      where: {
        userId,
      },
    });
    revalidatePath("/(portfolio)/portfolio/[slug]", "page");
    return data;
  } catch (error) {
    console.log(error);
  }
}
