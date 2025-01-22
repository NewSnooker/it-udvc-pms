"use client";

import { updateProjectSuccessStatusById } from "@/actions/projects";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Check, Loader } from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SuccessBtnProps {
  id: string;
  status: boolean;
  onStatusChange: (newStatus: boolean) => void; // เพิ่ม prop นี้
}

export default function SuccessBtn({
  id,
  status,
  onStatusChange,
}: SuccessBtnProps) {
  const [isSuccess, setIsSuccess] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(status);

  const handleToggle = useCallback(async () => {
    const newStatus = !isSuccess;
    setPendingStatus(newStatus);
    setIsDialogOpen(true);
  }, [isSuccess]);

  const handleConfirm = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await updateProjectSuccessStatusById(id, pendingStatus);

      if (res.ok) {
        setIsSuccess(pendingStatus);
        onStatusChange(pendingStatus); // อัปเดตผ่าน callback
        toast.success("โครงการอัปเดตสถานะสำเร็จ!");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating project success status:", error);
      setPendingStatus(isSuccess);
      toast.error("ไม่สามารถอัปเดตสถานะโครงการได้");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  }, [isLoading, id, pendingStatus, isSuccess, onStatusChange]);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`project-success-${id}`}
        checked={isSuccess}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <Label
        htmlFor={`project-success-${id}`}
        className={isSuccess ? "text-green-500" : "text-muted-foreground"}
      >
        {isSuccess ? (
          <Check className="h-4 w-4" />
        ) : (
          <Loader className="h-4 w-4" />
        )}
      </Label>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="py-10">
          <AlertDialogHeader>
            <AlertDialogTitle>คุณแน่ใจแล้วหรือไม่?</AlertDialogTitle>
            <AlertDialogDescription>
              เมื่อดำเนินการนี้ โครงการของคุณจะเปลี่ยนเป็นสถานะ{" "}
              <span
                className={
                  pendingStatus
                    ? "text-green-600 font-semibold"
                    : "text-yellow-600 font-semibold"
                }
              >
                {pendingStatus ? "เสร็จสิ้นโครงการ" : "กำลังดําเนินการ"}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction className="px-0">
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                ยืนยัน
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
