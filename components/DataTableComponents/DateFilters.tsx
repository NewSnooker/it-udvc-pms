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
  setIsSearch,
}: {
  data: any[];
  onFilter: any;
  setIsSearch: any;
}) {
  const options = [
    { value: "life", label: "Life time" },
    { value: "today", label: "Today" },
    { value: "last-7-days", label: "Last 7 days" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This year" },
  ];

  const [selectedFilter, setSelectedFilter] = useState(options[0].value);

  const handleChange = (value: string) => {
    setSelectedFilter(value);
    setIsSearch(false);

    let filteredData = data;

    if (value === "today") {
      filteredData = filterByToday(data);
    } else if (value === "yesterday") {
      filteredData = filterByYesterday(data);
    } else if (value === "last-7-days") {
      filteredData = filterByLast7Days(data);
    } else if (value === "month") {
      filteredData = filterByThisMonth(data);
    } else if (value === "year") {
      filteredData = filterByThisYear(data);
    }

    onFilter(filteredData);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter by date</SelectLabel>
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
