"use client";
import { ColumnDef } from "@tanstack/react-table";
import TitleColumn from "@/components/DataTableColumns/TitleColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import { Subscriber } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Send } from "lucide-react";
import AlertDialogSubscribersDelete from "@/components/dashboard/Tables/AlertDialogSubscribersDelete";
import SendEmailPrefetch from "@/components/DataTableColumns/SendEmailPrefetch";
export const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <TitleColumn column={column} title="อีเมลผู้ติดตาม" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TitleColumn column={column} title="วันที่เข้าร่วม" />
    ),
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    accessorKey: "id",
    header: "ลบผู้ติดตาม",

    cell: ({ row }) => {
      const original = row.original;
      return <AlertDialogSubscribersDelete id={original.id} />;
    },
  },
  {
    accessorKey: "email",
    header: "ส่งอีเมล",
    cell: ({ row }) => {
      const original = row.original;
      return <SendEmailPrefetch email={original.email} role="subscriber" />;
    },
  },
];
