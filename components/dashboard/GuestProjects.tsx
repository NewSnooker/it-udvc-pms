"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import emptyFolder from "@/public/images/empty-folder.png";
import emptyClient from "@/public/images/users-avatar.png";

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
import { GuestProject } from "@prisma/client";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

export default function GuestProjects({
  isOwner = false,
  projects,
}: {
  isOwner?: boolean;
  projects: GuestProject[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 border-b">
        <CardTitle>
          {isOwner ? "สมาชิกโครงการ" : "โครงการที่ได้เข้าร่วม"}
        </CardTitle>
        <CardDescription>
          {isOwner
            ? " แสดงรายละเอียดโครงการที่คุณได้เชิญสมาชิกมาเข้าร่วมดูแลโครงการของคุณ"
            : " แสดงรายละเอียดโครงการที่คุณได้ถูกเชิญและได้เข้าร่วมดูแลโครงการ"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)] overflow-y-auto">
          {projects?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-full">
                    รายละเอียด<span className="hidden sm:inline">โครงการ</span>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const link = project.projectLink.split("=")[1];
                  return (
                    <TableRow
                      key={project.id}
                      className="w-full border border-b"
                    >
                      <TableCell className="">
                        <div className="font-medium text-sm lg:text-lg line-clamp-1">
                          {project.projectName}
                        </div>
                        {isOwner ? (
                          <div className="text-xs sm:text-sm text-muted-foreground  line-clamp-1">
                            สมาชิก: คุณ{project.guestName}
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm text-muted-foreground  line-clamp-1">
                            จาก: คุณ{project.projectOwner}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="">
                        <Link href={`${link}`}>
                          <Button
                            size={"sm"}
                            className="ml-auto gap-1 text-xs sm:text-sm "
                          >
                            <span className="hidden sm:inline">เพิ่มเติม</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="w-full flex flex-col justify-center items-center min-h-[calc(100vh-16rem)] ">
              <div className=" flex flex-col justify-center items-center">
                <Image
                  src={isOwner ? emptyClient : emptyFolder}
                  alt="empty"
                  height={224}
                  width={224}
                  className="h-24 w-24  object-cover "
                />
                <p className="text-lg text-muted-foreground mt-4 mb-6">
                  {isOwner
                    ? "ไม่พบสมาชิกที่เข้าร่วม"
                    : "ไม่พบโครงการที่เข้าร่วม"}
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
