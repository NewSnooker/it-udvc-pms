"use client";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  FileText,
  Calendar,
  FolderPlus,
  ChevronsRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { DetailedUserProjects } from "@/types/types";
import receipt from "@/public/images/receipt.png";

export default function ProjectPayments({
  userProject,
}: {
  userProject: DetailedUserProjects[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const projectId = params.get("pid");

  const projectState = projectId
    ? userProject.find((p) => p.id === projectId) ?? userProject[0]
    : userProject[0];
  const [selectedProject, setSelectedProject] =
    useState<DetailedUserProjects | null>(projectState);

  useEffect(() => {
    if (projectId) {
      const project = userProject.find((p) => p.id === projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projectId, userProject]);

  const handleProjectSelect = (project: DetailedUserProjects) => {
    setSelectedProject(project);
    router.push(`/dashboard/payments?pid=${project.id}`);
  };

  // ถ้าไม่มี projects ให้ return component แสดงหน้า empty state
  if (!userProject || userProject.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4 p-8">
          <div className="flex justify-center">
            <FolderPlus className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">ไม่พบโครงการ</h2>
          <p className="text-muted-foreground max-w-sm">
            คุณยังไม่มีโครงการในระบบ สร้างโครงการแรกของคุณเพื่อเริ่มต้นใช้งาน
          </p>
          <Button onClick={() => router.push("/dashboard/projects/new")}>
            <FolderPlus className="mr-2 h-4 w-4" />
            สร้างโครงการใหม่
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-3/12 p-4 border-r">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            โครงการ{`(${userProject.length ?? 0})`}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/projects/new")}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          เลือกโครงการเพื่อดูการชำระเงิน
        </div>
        <ScrollArea className="h-auto md:h-[calc(100vh-11rem)] mt-4">
          {userProject.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectSelect(project)}
              className={`px-2 w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
              ${
                selectedProject?.id === project.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <div className="flex flex-row items-center gap-4 justify-between space-y-0 w-full ">
                <div className="flex flex-row items-center gap-2 ">
                  <Image
                    src={project.thumbnail ?? "/placeholder.png"}
                    alt={project.name}
                    width={40}
                    height={40}
                    className="aspect-square rounded-md object-cover p-1 "
                  />
                  <div className="text-sm line-clamp-1 font-medium">
                    {project.name}
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="text-sm ">
                    {project.payments?.length ?? 0}
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="w-full md:w-9/12 p-4">
        <h2 className="text-2xl font-bold">
          การชำระเงิน: {selectedProject?.name}
        </h2>
        <div className="text-sm text-muted-foreground">
          เลือกการชำระเงินเพื่อดูรายละเอียดของการชำระเงินในโครงการนี้
        </div>
        <ScrollArea className="h-auto sm:h-[calc(100vh-11rem)] mt-4">
          {selectedProject?.payments?.map((payment) => (
            <Card key={payment.id} className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="flex text-sm font-medium gap-1 ">
                  <div className=""> #{payment.invoiceNumber}</div>
                  <div className="hidden sm:block"> - {payment.title}</div>
                </CardTitle>
                <Link
                  href={`/project/invoice/${payment.id}?project=${selectedProject.slug}`}
                >
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    ดูใบแจ้งหนี้
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(payment.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div>
                    จำนวนเงิน:{" "}
                    {payment.amount.toLocaleString("th-TH", {
                      style: "currency",
                      currency: "THB",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!selectedProject?.payments ||
            selectedProject.payments.length === 0) && (
            <div className="flex flex-col items-center justify-center w-full h-full ">
              <Image
                src={receipt}
                alt="empty"
                height={224}
                width={224}
                className="h-24 w-24 object-cover "
              />
              <div className=" text-lg text-muted-foreground mt-2">
                ไม่พบรายการชำระเงินสำหรับโครงการนี้
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
