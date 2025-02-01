"use client";

import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@prisma/client";
import TitleColumn from "@/components/DataTableColumns/TitleColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NumberColumn from "@/components/DataTableColumns/NumberColumn";
import ProjectDeadline from "@/components/DataTableColumns/ProjectDeadline";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "thumbnail",
    header: "รูปภาพ",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="thumbnail" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <TitleColumn column={column} title="ชื่อโครงการ" />,
  },
  {
    accessorKey: "budget",
    header: ({ column }) => <TitleColumn column={column} title="งบประมาณ" />,
    cell: ({ row }) => <NumberColumn row={row} accessorKey="budget" />,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => <TitleColumn column={column} title="วันที่เริ่ม" />,
    cell: ({ row }) => <DateColumn row={row} accessorKey="startDate" />,
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <TitleColumn column={column} title="วันที่สิ้นสุด" />
    ),
    cell: ({ row }) => <DateColumn row={row} accessorKey="endDate" />,
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <TitleColumn column={column} title="กำหนดส่ง (วัน)" />
    ),
    cell: ({ row }) => {
      // const project = row.original;
      return <ProjectDeadline row={row} />;
    },
  },
  {
    accessorKey: "startDate",
    header: "เพิ่มเติม",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Button asChild size={"sm"}>
          <Link target="_blank" href={`/project/${project.slug}`}>
            เพิ่มเติม
          </Link>
        </Button>
      );
    },
  },
];
