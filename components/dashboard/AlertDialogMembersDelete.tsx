"use client";
import { Button } from "@/components/ui/button";
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

import { Copy, Loader, Mail, Send, Trash } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { deleteGuestProject } from "@/actions/guestProject";

export default function AlertDialogMembersDelete({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleMemberDelete() {
    setIsLoading(true);
    try {
      const res = await deleteGuestProject(id);
      if (res && res.ok) {
        setIsLoading(false);
        toast.success("ลบสมาชิกโครงการสําเร็จ!");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("ลบสมาชิกโครงการไม่สำเร็จ!");
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isLoading ? (
          <Button size="sm" variant="destructive" disabled>
            <Loader className="h-4 w-4 animate-spin" />
          </Button>
        ) : (
          <Button disabled={isLoading} variant="destructive" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="py-10">
        <AlertDialogHeader>
          <AlertDialogTitle>คุณแน่ใจแล้วหรือไม่?</AlertDialogTitle>
          <AlertDialogDescription>
            เมื่อดำเนินการนี้ไม่สามารถยกเลิกได้
            การดำเนินการนี้จะลบสมาชิกโครงการของคุณ
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction className="px-0">
            <Button
              variant={"destructive"}
              className="w-full sm:w-auto"
              onClick={() => handleMemberDelete()}
              disabled={isLoading}
            >
              ยืนยันการลบ
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
