"use client";

import { ColumnDef } from "@tanstack/react-table";
import TitleColumn from "@/components/DataTableColumns/TitleColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GuestProjectUserProps } from "@/types/types";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";

export const columns: ColumnDef<GuestProjectUserProps>[] = [
  {
    accessorKey: "ownerImage",
    header: "โปรไฟล์",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="ownerImage" />,
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <TitleColumn column={column} title="ชื่อเจ้าของโครงการ" />
    ),
  },
  // {
  //   accessorKey: "projectImage",
  //   header: "รูปภาพ",
  //   cell: ({ row }) => <ImageColumn row={row} accessorKey="projectImage" />,
  // },
  {
    accessorKey: "projectName",
    header: ({ column }) => <TitleColumn column={column} title="ชื่อโครงการ" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TitleColumn column={column} title="วันที่เข้าร่วม" />
    ),
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    accessorKey: "projectLink",
    header: "เพิ่มเติม",

    cell: ({ row }) => {
      const guestProject = row.original;
      return (
        <Button asChild size={"sm"}>
          <Link href={guestProject.projectLink}>เพิ่มเติม</Link>
        </Button>
      );
    },
  },
];
