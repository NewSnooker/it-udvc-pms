"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  filterByLast7Days,
  filterByThisMonth,
  filterByThisYear,
  filterByToday,
  filterByYesterday,
} from "@/lib/dateFilters";
import { useState } from "react";

export default function DateFilters({
  data,
  onFilter,
  initialRange,
}: {
  data: any[];
  onFilter: any;
  initialRange: any;
}) {
  const options = [
    { value: "life", label: "ทั้งหมด" },
    { value: "today", label: "วันนี้" },
    { value: "last-7-days", label: "7 วันที่ผ่านมา" },
    { value: "month", label: "เดือนนี้" },
    { value: "year", label: "ปีนี้" },
  ];

  const [selectedFilter, setSelectedFilter] = useState(options[0].value);

  const handleChange = (value: string) => {
    setSelectedFilter(value);

    let filteredData = data;
    let newRange;

    switch (value) {
      case "today":
        filteredData = filterByToday(data);
        newRange = { from: new Date(), to: new Date() };
        break;
      case "last-7-days":
        filteredData = filterByLast7Days(data);
        newRange = {
          from: new Date(new Date().setDate(new Date().getDate() - 7)),
          to: new Date(),
        };
        break;
      case "month":
        filteredData = filterByThisMonth(data);
        newRange = {
          from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          to: new Date(),
        };
        break;
      case "year":
        filteredData = filterByThisYear(data);
        newRange = {
          from: new Date(new Date().getFullYear(), 0, 1),
          to: new Date(),
        };
        break;
      case "life":
        filteredData = data;
        newRange = {
          from: initialRange.from,
          to: initialRange.to,
        };
        break;
      default:
        filteredData = data;
        newRange = {
          from: initialRange.from,
          to: initialRange.to,
        };
        break;
    }

    onFilter(filteredData, newRange);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[150px]">
        <SelectValue placeholder="ทั้้งหมด" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>เลือก</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
