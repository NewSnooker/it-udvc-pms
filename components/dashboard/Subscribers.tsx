"use client";

import Link from "next/link";
import { ArrowUpRight, Send, SendHorizontal } from "lucide-react";
import emptyUser from "@/public/images/empty-email.png";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@prisma/client";

import Image from "next/image";
import { SubscribeFormProps } from "../Forms/SubscribeForm";
import { ScrollArea } from "../ui/scroll-area";

export default function Subscribers({
  subscribers,
}: {
  subscribers: SubscribeFormProps[];
}) {
  const list = subscribers.map((item) => {
    const username = item.email.split("@")[0];
    return {
      username,
      email: item.email,
    };
  });
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between border-b ">
        <div className="flex flex-col gap-2">
          <CardTitle>อีเมลผู้ติดตาม</CardTitle>
          <CardDescription>แสดงรายข้อมูลอีเมลผู้ติดตามของคุณ</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)] overflow-y-auto">
          {subscribers?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    ชื่อ<span className="hidden sm:inline">ผู้ติดตาม</span>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((item, i) => (
                  <TableRow key={i} className="">
                    <TableCell className="w-full">
                      <div className="font-medium">{item.username}</div>
                      <div className="font-medium text-muted-foreground text-xs">
                        {item.email}
                      </div>
                    </TableCell>
                    <TableCell className="">
                      <Button size="sm" className="ml-auto gap-1 sm:gap-2">
                        <span className="hidden sm:inline">ส่งอีเมล</span>
                        <Send className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="w-full flex flex-col justify-center items-center min-h-[calc(100vh-16rem)]">
              <Image
                src={emptyUser}
                alt="empty"
                height={224}
                width={224}
                className="h-24 w-24  object-cover "
              />
              <p className="text-lg text-muted-foreground mt-4 mb-6">
                ไม่พบอีเมลผู้ติดตาม
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
