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
  // {
  //   accessorKey: "deadline",
  //   header: ({ column }) => (
  //     <TitleColumn column={column} title="กำหนดส่ง (วัน)" />
  //   ),
  //   cell: ({ row }) => <ProjectDeadline row={row} />,
  // },
  // {
  //   accessorKey: "startDate",
  //   header: ({ column }) => <TitleColumn column={column} title="วันที่เริ่ม" />,
  //   cell: ({ row }) => <DateColumn row={row} accessorKey="startDate" />,
  // },
  // {
  //   accessorKey: "isPublic",
  //   header: "แฟ้มผลงาน",

  //   cell: ({ row }) => {
  //     const project = row.original;
  //     return <PublicityBtn id={project.id} status={project.isPublic} />;
  //   },
  // },
  // {
  //   accessorKey: "startDate",
  //   header: "เพิ่มเติม",

  //   cell: ({ row }) => {
  //     const project = row.original;
  //     return (
  //       <Button asChild size={"sm"}>
  //         <Link href={`/project/${project.slug}`}>เพิ่มเติม</Link>
  //       </Button>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => <TitleColumn column={column} title="วันที่สร้าง" />,
  //   cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  // },
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
