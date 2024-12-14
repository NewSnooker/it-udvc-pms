"use client";

import { updateProjectPublicityById } from "@/actions/projects";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";

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
    <div className="flex items-center">
      <input
        type="checkbox"
        aria-label="Toggle project publicity"
        checked={isPublic}
        onChange={handleToggle}
        disabled={isLoading}
        className={`
          toggle toggle-accent
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1
        `}
      />
      {/* {isLoading && (
        <span className="ml-2 loading loading-spinner loading-xs text-neutral-content"></span>
      )} */}
    </div>
  );
}
