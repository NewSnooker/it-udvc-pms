"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Loader, Trash } from "lucide-react";
import { deletePayment } from "@/actions/payment";
import toast from "react-hot-toast";

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
    <Button
      variant="outline"
      size={"sm"}
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Trash className="h-4 w-4" />
      )}
    </Button>
  );
}
