"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import DialogInviteClient from "./DialogInviteClient";
import { PlusCircle } from "lucide-react";
import DialogExportFile from "./DialogExportFile";

// กำหนดประเภทของ props ที่ส่งเข้ามา
type TableHeaderProps = {
  title: string; // หัวข้อ
  href?: string; // ลิงก์ (ถ้ามี)
  linkTitle?: string; // ข้อความของลิงก์ (ถ้ามี)
  data: any[]; // ข้อมูล
  model: string; // ชื่อโมเดล
  userId?: string | null | undefined; // ไอดีผู้ใช้
};

export default function TableHeader({
  title,
  href,
  linkTitle,
  data,
  model,
  userId,
}: TableHeaderProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-zinc-200 dark:border-zinc-600 py-3">
        <h2 className="scroll-m-20 text-center sm:text-left text-2xl font-semibold tracking-tight">
          {title} ({data.length})
        </h2>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:ml-auto">
          {/* ปุ่มส่งออก */}
          <DialogExportFile title={title} data={data} />

          {model === "clients" && <DialogInviteClient userId={userId ?? ""} />}

          {href && linkTitle && (
            <Button size="sm" asChild className="h-8">
              <Link href={href}>
                <PlusCircle className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline whitespace-nowrap">
                  {linkTitle}
                </span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
