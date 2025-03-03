import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export default function TitleColumn({
  column,
  title,
}: {
  column: any;
  title: string;
}) {
  return (
    <Button
      className="-m-4"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
