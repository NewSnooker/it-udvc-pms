"use client";
import { filterByDateRange } from "@/lib/dateFilters";
import React, { useEffect } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale"; // ใช้ locale ภาษาไทย
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DateRangeFilter({
  data,
  onFilter,
  className,
  initialRange,
  onRangeChange,
}: {
  data: any[];
  onFilter: any;
  className?: string;
  initialRange: any;
  onRangeChange: any;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialRange);

  useEffect(() => {
    if (initialRange) {
      setDate(initialRange);
    }
  }, [initialRange]);

  const handleChange = (selectedDate: DateRange | undefined) => {
    // อัปเดต state
    setDate(selectedDate);
    onRangeChange(selectedDate);

    // กรองข้อมูลตามวันที่
    const filteredData = filterByDateRange(
      data,
      selectedDate?.from ? format(selectedDate.from, "yyyy-MM-dd") : "",
      selectedDate?.to ? format(selectedDate.to, "yyyy-MM-dd") : ""
    );
    onFilter(filteredData);
  };
  const initialFromDate = new Date(initialRange.from);
  initialFromDate.setHours(0, 0, 0, 0);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[300px] justify-start text-left font-normal px-2 sm:px-3",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "d MMMM yyyy", { locale: th })} -{" "}
                  {format(date.to, "d MMMM yyyy", { locale: th })}
                </>
              ) : (
                format(date.from, "d MMMM yyyy", { locale: th })
              )
            ) : (
              <span>เลือกวันที่</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(value) => handleChange(value)}
            numberOfMonths={2}
            disabled={(date) => date > new Date() || date < initialFromDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
