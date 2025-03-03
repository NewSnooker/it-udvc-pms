"use client";

import { ColumnDef } from "@tanstack/react-table";
import TitleColumn from "@/components/DataTableColumns/TitleColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GuestProjectUserProps } from "@/types/types";
import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import { Send, Trash } from "lucide-react";
import AlertDialogMembersDelete from "@/components/dashboard/AlertDialogMembersDelete";
import SendEmailPrefetch from "@/components/DataTableColumns/SendEmailPrefetch";

export const columns: ColumnDef<GuestProjectUserProps>[] = [
  {
    accessorKey: "guestImage",
    header: "โปรไฟล์",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="guestImage" />,
  },
  {
    accessorKey: "guestName",
    header: ({ column }) => (
      <TitleColumn column={column} title="ชื่อสมาชิกโครงการ" />
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
    accessorKey: "email",
    header: "ส่งอีเมล",
    cell: ({ row }) => {
      const original = row.original;
      return <SendEmailPrefetch email={original.guestEmail} role="member" />;
    },
  },
  {
    accessorKey: "id",
    header: "ลบสมาชิก",
    cell: ({ row }) => {
      const original = row.original;
      return <AlertDialogMembersDelete id={original.id} />;
    },
  },
  {
    accessorKey: "projectLink",
    header: "เพิ่มเติม",
    cell: ({ row }) => {
      const guestProject = row.original;
      return (
        <Button asChild size={"sm"}>
          <Link target="_blank" href={guestProject.projectLink}>
            เพิ่มเติม
          </Link>
        </Button>
      );
    },
  },
];
