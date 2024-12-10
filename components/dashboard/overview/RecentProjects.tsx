"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import emptyFolder from "@/public/images/empty-folder.png";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@prisma/client";
import ProjectRecentTableRow from "./ProjectRecentTableRow";
import Image from "next/image";

export default function RecentProjects({
  recentProjects,
}: {
  recentProjects: Project[];
}) {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle>โครงการล่าสุด</CardTitle>
        <Link href="/dashboard/projects">
          <Button size="sm" className="ml-auto gap-1">
            <span className="hidden sm:inline">เพิ่มเติม</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentProjects?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รูปภาพ</TableHead>
                <TableHead>
                  ชื่อ<span className="hidden sm:inline">โครงการ</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProjects.map((project) => (
                <ProjectRecentTableRow key={project.id} project={project} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="w-full flex flex-col justify-center items-center sm:min-h-64 ">
            <div className="">
              <Image
                src={emptyFolder}
                alt="empty"
                height={224}
                width={224}
                className="h-24 w-24  object-cover "
              />
              <p className="text-lg text-muted-foreground mt-4 mb-6">
                ไม่พบโครงการ
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
