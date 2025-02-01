"use client";

import ImageColumn from "@/components/DataTableColumns/ImageColumn";
import { ColumnDef } from "@tanstack/react-table";
import ActionColumn from "@/components/DataTableColumns/ActionColumn";
import { User } from "@prisma/client";
import TitleColumn from "@/components/DataTableColumns/TitleColumn";
import DateColumn from "@/components/DataTableColumns/DateColumn";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import SendEmailPrefetch from "@/components/DataTableColumns/SendEmailPrefetch";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "รูปภาพ",
    cell: ({ row }) => <ImageColumn row={row} accessorKey="image" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <TitleColumn column={column} title="ชื่อ" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <TitleColumn column={column} title="เบอร์โทร" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <TitleColumn column={column} title="อีเมล" />,
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => <TitleColumn column={column} title="เชิญ" />,
  //   cell: ({ row }) => <InviteClient row={row} />,
  // },
  {
    accessorKey: "location",
    header: ({ column }) => <TitleColumn column={column} title="ที่อยู่" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <TitleColumn column={column} title="วันที่สร้าง" />,
    cell: ({ row }) => <DateColumn row={row} accessorKey="createdAt" />,
  },
  {
    accessorKey: "email",
    header: "ส่งอีเมล",
    cell: ({ row }) => {
      const original = row.original;
      return <SendEmailPrefetch email={original.email} role="client" />;
    },
  },
  {
    id: "จัดการ",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <ActionColumn
          row={row}
          model="clients"
          title="ลูกค้า"
          editEndpoint={`clients/update/${category.id}`}
          id={category.id}
        />
      );
    },
  },
];
