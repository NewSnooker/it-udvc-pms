"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { deleteCategory } from "@/actions/categories";
import toast from "react-hot-toast";
import Link from "next/link";
import { deleteUser } from "@/actions/users";
import { deleteProject } from "@/actions/projects";

type ActionColumnProps = {
  row: any;
  model: any;
  editEndpoint: string;
  id: string | undefined;
  title: string;
  // revPath: string;
};
export default function ActionColumn({
  row,
  model,
  editEndpoint,
  id = "",
  title,
}: ActionColumnProps) {
  const isActive = row.isActive;
  async function handleDelete() {
    try {
      if (model === "category") {
        const res = await deleteCategory(id);
        if (res?.ok) {
          window.location.reload();
        }
        toast.success(`ลบ${title} สําเร็จ`);
      } else if (model === "clients") {
        const res = await deleteUser(id);
        if (res?.ok) {
          window.location.reload();
        }
        toast.success(`ลบ${title} สําเร็จ`);
      } else if (model === "projects") {
        const res = await deleteProject(id);
        if (res?.ok) {
          window.location.reload();
        }
        toast.success(`ลบ${title} สําเร็จ`);
      }
    } catch (error) {
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการลบ" + title);
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">เปิด</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>จัดการ</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            {/* <DropdownMenuItem className="text-red-600 hover:text-red-700 transition-all duration-500 cursor-pointer">

            </DropdownMenuItem> */}
            <Button
              variant={"ghost"}
              size={"sm"}
              className="text-red-600 hover:text-red-700 cursor-pointer rounded-sm w-full flex items-center justify-start "
            >
              <Trash className="w-4 h-4  mr-2 flex-shrink-0" />
              <div>ลบ</div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>คุณแน่ใจแล้วหรือไม่?</AlertDialogTitle>
              <AlertDialogDescription>
                การดำเนินการนี้ไม่สามารถยกเลิกได้
                การดำเนินการนี้จะลบสิ่งนี้อย่างถาวร
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <Button variant={"destructive"} onClick={() => handleDelete()}>
                ยืนยันการลบ
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* <DropdownMenuItem
          className="text-red-600 hover:text-red-700 transition-all duration-500 cursor-pointer"
          onClick={() => handleDelete()}
        >
          <Trash className="w-4 h-4  mr-2 flex-shrink-0" />
          <span>Delete</span>
        </DropdownMenuItem> */}
        <Link href={editEndpoint} className="cursor-pointer">
          <DropdownMenuItem>
            <div className="flex items-center px-1 gap-2 cursor-pointer w-full">
              <Pencil className="w-4 h-4 " />
              <span>แก้ไข</span>
            </div>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
