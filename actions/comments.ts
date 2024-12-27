"use server";

import { db } from "@/prisma/db";
import { CommentProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createComment(data: CommentProps) {
  try {
    const newComment = await db.projectComment.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/projects");
    return newComment;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updateCommentById(id: string, data: CommentProps) {
  try {
    const updatedComment = await db.projectComment.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/projects");
    return updatedComment;
  } catch (error) {
    console.log(error);
  }
}
export async function getCommentById(id: string) {
  try {
    const comment = await db.projectComment.findUnique({
      where: {
        id,
      },
    });
    return comment;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteComment(id: string) {
  try {
    const deletedComment = await db.projectComment.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deletedComment,
    };
  } catch (error) {
    console.log(error);
  }
}
