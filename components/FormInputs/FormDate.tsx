"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale"; // ใช้ locale ภาษาไทย
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { convertDateToIso } from "@/lib/convertDateToIso";

export default function FormDate({
  label,
  name,
  className,
  initialDate,
  error,
  onDateChange,
}: {
  label: string;
  name: string;
  className?: string;
  initialDate?: Date | undefined;
  error?: boolean;
  onDateChange: (name: string, date: string | undefined) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const newSelectedDate = convertDateToIso(formattedDate);
      setDate(selectedDate);
      onDateChange(name, newSelectedDate);
    } else {
      setDate(undefined);
      onDateChange(name, undefined);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <Popover>
        <PopoverTrigger asChild className="w-full ">
          <Button
            id={name}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal px-2 sm:px-3",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "d MMMM yyyy", { locale: th })
            ) : (
              <span>เลือกวันที่ {label}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            captionLayout="dropdown" // เพิ่ม dropdown สำหรับเดือนและปี
            fromYear={new Date().getFullYear() - 10}
            toYear={new Date().getFullYear() + 10}
            defaultMonth={date}
            selected={date}
            onSelect={handleDateChange} // ใช้ฟังก์ชันที่จัดการการเปลี่ยนแปลง
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-xs text-red-600">กรุณาเลือกวันที่ {label}</p>
      )}
    </div>
  );
}
