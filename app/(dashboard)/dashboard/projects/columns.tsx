"use client";

import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { Project } from "@prisma/client";
import TitleColumn from "@/components/DataTableColumns/TitleColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NumberColumn from "@/components/DataTableColumns/NumberColumn";
import ProjectDeadline from "@/components/DataTableColumns/ProjectDeadline";
import PublicityBtn from "@/components/DataTableComponents/PublicityBtn";
import SuccessBtn from "@/components/DataTableComponents/SuccessBtn";

export const createColumns = (projectStatuses: {
  [key: string]: { status: boolean; setStatus: (status: boolean) => void };
}): ColumnDef<Project>[] => [
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
    accessorKey: "budget",
    header: ({ column }) => <TitleColumn column={column} title="งบประมาณ" />,
    cell: ({ row }) => <NumberColumn row={row} accessorKey="budget" />,
  },
  {
    accessorKey: "isPublic",
    header: "แฟ้มผลงาน",
    cell: ({ row }) => {
      const project = row.original;
      return <PublicityBtn id={project.id} status={project.isPublic} />;
    },
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <TitleColumn column={column} title="กำหนดส่ง (วัน)" />
    ),
    cell: ({ row }) => {
      const project = row.original;
      const statusHandler = projectStatuses[project.id];
      return <ProjectDeadline row={row} currentStatus={statusHandler.status} />;
    },
  },
  {
    accessorKey: "isSuccessStatus",
    header: "สถานะ",
    cell: ({ row }) => {
      const project = row.original;
      const statusHandler = projectStatuses[project.id];
      return (
        <SuccessBtn
          project={project}
          status={statusHandler.status}
          onStatusChange={statusHandler.setStatus}
        />
      );
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
  {
    id: "จัดการ",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <ActionColumn
          row={row}
          model="projects"
          title="โครงการ"
          editEndpoint={`projects/update/${project.id}`}
          id={project.id}
        />
      );
    },
  },
];
