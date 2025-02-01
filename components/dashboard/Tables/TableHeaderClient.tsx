"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import DialogInviteClient from "./DialogInviteClient";
import { PlusCircle } from "lucide-react";
import DialogExportFile from "./DialogExportFile";

// กำหนดประเภทของ props ที่ส่งเข้ามา
type TableHeaderClientProps = {
  title: string; // หัวข้อ
  data: any[]; // ข้อมูล
};

export default function TableHeaderClient({
  title,
  data,
}: TableHeaderClientProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-zinc-200 dark:border-zinc-600 py-3">
        <h2 className="scroll-m-20 text-center sm:text-left text-2xl font-semibold tracking-tight">
          {title} ({data.length})
        </h2>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:ml-auto">
          {/* ปุ่มส่งออก */}
          <DialogExportFile title={title} data={data} />
        </div>
      </div>
    </div>
  );
}
