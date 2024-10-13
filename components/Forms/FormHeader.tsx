"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type FormHeaderProps = {
  title: string;
  editingId: string | undefined;
};
export default function FormHeader({ title, editingId }: FormHeaderProps) {
  const router = useRouter();

  function goBack() {
    router.back();
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <Button
          onClick={goBack}
          variant="outline"
          size="icon"
          className="h-7 w-7"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">กลับ</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {editingId ? "อัพเดต" : "สร้าง"}
          {title}
        </h1>
      </div>
    </div>
  );
}
