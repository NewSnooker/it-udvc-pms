"use client";

import Link from "next/link";
import { Loader, Send, Trash } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { SubscribeFormProps } from "../Forms/SubscribeForm";
import { ScrollArea } from "../ui/scroll-area";
import { deleteSubscribers } from "@/actions/subscribe";
import { useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import "moment/locale/th";
moment.locale("th");

export default function Subscribers({
  subscribers,
}: {
  subscribers: SubscribeFormProps[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const list = subscribers.map((item) => {
    const username = item.email.split("@")[0];
    return {
      username,
      email: item.email,
      id: item.id,
      createdAt: item.createdAt,
    };
  });

  async function handleSubscribersDelete(id: string) {
    setIsLoading(true);
    try {
      const res = await deleteSubscribers(id);
      if (res && res.ok) {
        setIsLoading(false);
        toast.success("ลบอีเมลผู้ติดตามสําเร็จ!");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("ลบอีเมลผู้ติดตามไม่สำเร็จ!");
    }
  }
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
                  <TableHead className="w-1/5">
                    ชื่อ<span className="hidden sm:inline">ผู้ติดตาม</span>
                  </TableHead>
                  <TableHead className="w-full">
                    วันที่<span className="hidden sm:inline">สมัคร</span>
                  </TableHead>
                  <TableHead className=""></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="font-medium">{item.username}</div>
                      <div className="font-medium text-muted-foreground text-xs">
                        {item.email}
                      </div>
                    </TableCell>
                    <TableCell className="">
                      <div className="font-medium text-muted-foreground text-xs">
                        {moment(item.createdAt).format("L")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right flex gap-2 ">
                      <Link
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}&su=Your+Subject+Here&body=Your+Body+Text+Here`}
                        target="_blank"
                      >
                        <Button size="sm" className="ml-auto gap-1 sm:gap-2">
                          <span className="hidden sm:inline">ส่งอีเมล</span>
                          <Send className="h-4 w-4" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          {isLoading ? (
                            <Button size="sm" variant="destructive" disabled>
                              <Loader className="h-4 w-4 animate-spin" />
                            </Button>
                          ) : (
                            <Button
                              disabled={isLoading}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </AlertDialogTrigger>
                        <AlertDialogContent className="py-10">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              คุณแน่ใจแล้วหรือไม่?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              เมื่อดำเนินการนี้ไม่สามารถยกเลิกได้
                              การดำเนินการนี้จะลบสิ่งนี้อย่างถาวร
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction className="px-0">
                              <Button
                                variant={"destructive"}
                                className="w-full sm:w-auto"
                                onClick={() =>
                                  handleSubscribersDelete(item.id as string)
                                }
                                disabled={isLoading}
                              >
                                ยืนยันการลบ
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
