"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { th } from "date-fns/locale"; // นำเข้า locale ภาษาไทย
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarHeader({
  currentMonth,
  currentYear,
  changeMonth,
  changeYear,
}: {
  currentMonth: Date;
  currentYear: number;
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
}) {
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex items-center gap-2 px-2">
      <div className="flex items-center gap-1">
        <span className="text-sm">เดือน:</span>
        <Select
          value={currentMonth.getMonth().toString()}
          onValueChange={(value) => changeMonth(Number.parseInt(value))}
        >
          <SelectTrigger className="h-8 w-[100px]">
            <SelectValue>{months[currentMonth.getMonth()]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm">ปี:</span>
        <Select
          value={currentYear.toString()}
          onValueChange={(value) => changeYear(Number.parseInt(value))}
        >
          <SelectTrigger className="h-8 w-[80px]">
            <SelectValue>{currentYear}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date());

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(month);
    newDate.setMonth(monthIndex);
    setMonth(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(month);
    newDate.setFullYear(year);
    setMonth(newDate);
  };

  return (
    <DayPicker
      locale={th} // ตั้งค่า locale เป็นภาษาไทย
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={month}
      onMonthChange={setMonth}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-start relative items-center h-10 mb-2",
        caption_label: "hidden",
        nav: "flex items-center gap-1 absolute right-0",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 text-muted-foreground hover:text-primary"
        ),
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "w-9 font-normal text-[0.8rem] text-muted-foreground",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ ...props }) => (
          <CalendarHeader
            currentMonth={month}
            currentYear={month.getFullYear()}
            changeMonth={handleMonthChange}
            changeYear={handleYearChange}
          />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
