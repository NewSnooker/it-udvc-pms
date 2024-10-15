"use client";

import { Checkbox } from "@/components/ui/checkbox";

import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { Project } from "@prisma/client";
import TitleColumn from "@/components/DataTableColumns/TitleColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

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
    accessorKey: "startDate",
    header: "ดูเพิ่มเติม",

    cell: ({ row }) => {
      return (
        <Button asChild size={"sm"}>
          <Link href={"/dashboard/projects/view/name-project"}>
            ดูเพิ่มเติม
          </Link>
        </Button>
      );
    },
  },
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
          title="ลูกค้า"
          editEndpoint={`clients/update/${project.id}`}
          id={project.id}
        />
      );
    },
  },
];
