/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { updateProjectSuccessStatusById } from "@/actions/projects";
import React, { useState, useCallback, useEffect } from "react";
import toasts from "react-hot-toast";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Check, Loader, MailIcon } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { getEmailById } from "@/actions/users";
import { Project } from "@prisma/client";

interface SuccessBtnProps {
  project: Project;
  status: boolean;
  onStatusChange: (newStatus: boolean) => void; // เพิ่ม prop นี้
}

export default function SuccessBtn({
  project,
  status,
  onStatusChange,
}: SuccessBtnProps) {
  const [isSuccess, setIsSuccess] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(status);
  const [emailClient, setEmailClient] = useState("");
  const { toast } = useToast();

  const id = project.id;

  const getEmail = async () => {
    const email = (await getEmailById(project.clientId)) || "";
    setEmailClient(email);
  };

  useEffect(() => {
    getEmail();
  }, []);

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
        onStatusChange(pendingStatus);
        toasts.success("โครงการอัปเดตสถานะสำเร็จ!");
        {
          !isSuccess &&
            toast({
              title: "โครงการเสร็จสิ้นแล้ว✨🎊",
              description: `โครงการของคุณเสร็จสิ้นแล้ว\n (${project.name}) \nคุณสามารถติดต่อกับลูกค้าของคุณได้ที่นี่`,
              action: (
                <ToastAction altText="ติดต่อ">
                  <MailIcon className="mr-1.5 h-4 w-4" />
                  <Link
                    href={`/dashboard/emails?mail=${emailClient}&role=client`}
                  >
                    ติดต่อ
                  </Link>{" "}
                </ToastAction>
              ),
            });
        }
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating project success status:", error);
      setPendingStatus(isSuccess);
      toasts.error("ไม่สามารถอัปเดตสถานะโครงการได้");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  }, [
    isLoading,
    id,
    pendingStatus,
    onStatusChange,
    isSuccess,
    toast,
    project.name,
    emailClient,
  ]);

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
