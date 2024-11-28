"use client";
import { Project } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ProjectDeadlineProps {
  row: Row<Project>;
}
export default function ProjectDeadline({ row }: ProjectDeadlineProps) {
  const [daysDifference, setDaysDifference] = useState(0);
  const projectData: Project = row.original;

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

  function formatDaysDifference(days: number): string {
    if (days > 0) {
      return `เหลือเวลา ${days} วัน`;
    } else if (days < 0) {
      return `เกินกำหนด ${Math.abs(days)} วันที่ผ่านมา`;
    } else {
      return "สิ้นสุดโครงการวันนี้!";
    }
  }

  useEffect(() => {
    if (projectData.endDate) {
      setDaysDifference(calculateDaysDifference(projectData.endDate));
    }
    const interval = setInterval(() => {
      if (projectData.endDate) {
        setDaysDifference(calculateDaysDifference(projectData.endDate));
      }
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [projectData.endDate]);

  return (
    <div className="pl-7 text-sm flex">
      <div
        className={` font-medium ${
          daysDifference <= 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        {projectData?.endDate
          ? formatDaysDifference(daysDifference)
          : "กำลังดําเนินการ"}
      </div>
    </div>
  );
}
