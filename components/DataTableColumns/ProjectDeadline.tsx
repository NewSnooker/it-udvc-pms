"use client";

import { Project } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ProjectDeadlineProps {
  row: Row<Project>;
  currentStatus?: boolean; // เพิ่ม prop นี้
}

export default function ProjectDeadline({
  row,
  currentStatus,
}: ProjectDeadlineProps) {
  const projectData: Project = row.original;
  const [daysDifference, setDaysDifference] = useState(0);
  // ใช้ currentStatus จาก prop แทนการอ่านจาก projectData โดยตรง
  const isSuccess = currentStatus ?? projectData.isSuccessStatus;

  function calculateDaysDifference(enDate: string | Date): number {
    const end = new Date(enDate);
    const now = new Date();

    // ตั้งเวลาให้เป็นเที่ยงคืน (00:00:00) เพื่อให้เปรียบเทียบเฉพาะวัน
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  function formatDaysDifference(days: number): JSX.Element {
    if (days > 0) {
      return <span className="text-yellow-600">{`เหลือเวลา ${days} วัน`}</span>;
    } else if (days < 0) {
      return (
        <span className="text-red-600">{`เกินกำหนด ${Math.abs(
          days
        )} วัน`}</span>
      );
    } else {
      return <span className="text-red-600">กำหนดส่งวันนี้!</span>;
    }
  }

  useEffect(() => {
    if (projectData.endDate) {
      setDaysDifference(calculateDaysDifference(projectData.endDate));
    }
  }, [projectData.endDate]);

  return (
    <div>
      {isSuccess ? (
        <span className="text-green-600">เสร็จสิ้นโครงการ</span>
      ) : projectData?.endDate ? (
        <span>{formatDaysDifference(daysDifference)}</span>
      ) : (
        <span>ไม่มีกําหนดส่ง</span>
      )}
    </div>
  );
}
