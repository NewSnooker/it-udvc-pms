"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader, Trash } from "lucide-react";
import { deletePayment } from "@/actions/payment";
import toast from "react-hot-toast";
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

export default function PaymentDeleteButton({
  paymentId,
}: {
  paymentId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deletePayment(paymentId);
      if (res?.ok) {
        setIsLoading(false);
        toast.success("ลบการชําระเงินสําเร็จ");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("เกิดข้อผิดพลาดในการลบการชําระเงิน");
      console.error(error);
    }
  };
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
            การดำเนินการนี้จะลบสิ่งนี้อย่างถาวร
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction className="px-0">
            <Button
              variant={"destructive"}
              className="w-full sm:w-auto"
              onClick={handleDelete}
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
