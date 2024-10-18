import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@prisma/client";
export default function ProjectSummary({ data }: { data: any[] }) {
  const totalRevenue = data.reduce((acc, item) => {
    return acc + (item.budget ?? 0);
  }, 0);
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>โครงการทั้งหมด</CardTitle>
          <CardDescription>แสดงรายละเอียดโครงการ</CardDescription>
        </div>
        <div className="flex">
          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              จำนวน
              <br />
              ทั้งหมด
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {data.length.toString().padStart(2, "0")}
            </span>
          </button>
          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              รายได้
              <br />
              ทั้งหมด
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalRevenue.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
    </Card>
  );
}
