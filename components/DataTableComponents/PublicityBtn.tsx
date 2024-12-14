"use client";

import { updateProjectPublicityById } from "@/actions/projects";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface PublicityBtnProps {
  id: string;
  status: boolean;
}

export default function PublicityBtn({ id, status }: PublicityBtnProps) {
  const [isPublic, setIsPublic] = useState(status);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const newStatus = !isPublic;
      setIsPublic(newStatus);
      const res = await updateProjectPublicityById(id, newStatus);
      if (res.ok) {
        toast.success("โครงการอัปเดตสถานะสำเร็จ!");
      } else {
        setIsPublic(status);
        toast.error("ไม่สามารถอัปเดตสถานะโครงการได้");
      }
    } catch (error) {
      setIsPublic(status);
      console.error("Error updating project publicity:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดต กรุณาลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  }, [id, isLoading, isPublic, status]);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`project-publicity-${id}`}
        checked={isPublic}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <Label
        htmlFor={`project-publicity-${id}`}
        className={isPublic ? "" : "text-muted-foreground"}
      >
        {isPublic ? "สาธารณะ" : "ส่วนตัว"}
      </Label>
    </div>
  );
}
