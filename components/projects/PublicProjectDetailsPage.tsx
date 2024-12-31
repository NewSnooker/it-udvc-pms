/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import emptyFolder from "@/public/images/empty-folder.png";
import noSpeak from "@/public/images/no-speak.png";
import prohibition from "@/public/images/prohibition.png";
import moment from "moment";
import "moment/locale/th";
moment.locale("th");
import parse from "html-react-parser";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { ProjectData } from "@/types/types";
import NotesForm from "@/components/Forms/NotesForm";
import { getInitials } from "@/lib/generateInitials";
import PublicProjectDomainsCard from "./PublicProjectDomainsCard";
import PublicProjectBanner from "./PublicProjectBanner";
import { useSearchParams } from "next/navigation";

export default function PublicProjectDetailsPage({
  projectData,
}: {
  projectData: ProjectData;
}) {
  const searchParams = useSearchParams();

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [daysDifference, setDaysDifference] = useState(0);
  const [currentTab, setCurrentTab] = useState("modules");

  const tabs = [
    { value: "modules", label: "ฟังค์ชั่นโครงการ" },
    { value: "notes", label: "โน๊ต" },
    { value: "comments", label: "คอมเมนต์" },
  ];
  useEffect(() => {
    // ตรวจสอบค่าจาก URL หรือพารามิเตอร์ query
    const tab = searchParams.get("tab");
    if (tab && tabs.some((t) => t.value === tab)) {
      setCurrentTab(tab); // ตั้งค่าตามพารามิเตอร์
    }
  }, [searchParams]); // ใช้ searchParams ใน dependency array เพื่อให้ตรวจสอบทุกครั้งที่ URL เปลี่ยน

  function calculateDaysDifference(enDate: string | Date): number {
    const end = new Date(enDate);
    const now = new Date();

    // ตั้งเวลาให้เป็นเที่ยงคืน (00:00:00) เพื่อให้เปรียบเทียบเฉพาะวัน
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  function formatDaysDifference(days: number): string {
    if (days > 0) {
      return `เหลือเวลา ${days} วัน`;
    } else if (days < 0) {
      return `เกินกำหนด ${Math.abs(days)} วันที่ผ่านมา`;
    } else {
      return "สิ้นสุดโครงการวันนี้!";
    }
  }

  useEffect(() => {
    if (projectData.endDate) {
      setDaysDifference(calculateDaysDifference(projectData.endDate));
    }
    const interval = setInterval(() => {
      if (projectData.endDate) {
        setDaysDifference(calculateDaysDifference(projectData.endDate));
      }
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [projectData.endDate]);

  return (
    <div className=" bg-zinc-100 dark:bg-zinc-950">
      <div className="container mx-auto pt-4 pb-10 space-y-6">
        {/* Banner */}
        <PublicProjectBanner
          banner={projectData.bannerImage}
          name={projectData.name}
          bg={projectData.gradient}
        />
        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="md:col-span-4 space-y-4">
            {/* Description */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>รายละเอียดโครงการ</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{projectData.description}</p>
              </CardContent>
            </Card>
            {/* Tabs */}
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="mb-4"
            >
              <TabsList className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-start h-fit w-full sm:w-fit mb-4">
                {tabs.map((tab) => (
                  <Link
                    key={tab.value}
                    href={`/public/project/${projectData.slug}?tab=${tab.value}`}
                    scroll={false}
                    shallow
                    className="w-full"
                  >
                    <TabsTrigger value={tab.value} className="w-full">
                      {tab.label}
                    </TabsTrigger>
                  </Link>
                ))}
              </TabsList>
              <TabsContent value="modules">
                {/* Project Modules */}
                <Card className="sm:min-h-96">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                      <CardTitle className="mb-3 sm:mb-0">
                        ฟังก์ชั่นโครงการ{" "}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6 w-full ">
                      {projectData.modules.length > 0 ? (
                        projectData.modules.map((module, index) => (
                          <div
                            key={index}
                            className="h-fit group transition-all ease-in-out"
                          >
                            <div className="text-sm w-full flex items-center justify-between shadow-md bg-zinc-100 dark:bg-background dark:border dark:hover:border-none px-4 pr-2 sm:px-6 sm:pr-4 py-4 rounded-lg ">
                              <span>{module.name}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="w-full col-span-full flex flex-col items-center p-8 ">
                          <Image
                            src={emptyFolder}
                            alt="empty"
                            height={224}
                            width={224}
                            className="h-24 w-24  object-cover "
                          />
                          <p className="text-lg text-muted-foreground mt-4 mb-6">
                            ไม่พบฟังก์ชั่นโครงการ
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="notes">
                {/* Notes */}
                <Card className="sm:min-h-96">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>โน๊ต</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {projectData.notes &&
                    projectData.notes !==
                      `{"type":"doc","content":[{"type":"paragraph"}]}` ? (
                      <NotesForm
                        editingId={projectData.id}
                        initialNotes={(() => {
                          try {
                            return projectData.notes
                              ? JSON.parse(projectData.notes)
                              : [];
                          } catch (error) {
                            return [];
                          }
                        })()}
                        setIsEditingNotes={setIsEditingNotes}
                        isEditingNotes={false}
                      />
                    ) : (
                      <div className="w-full col-span-full flex flex-col items-center ">
                        <Image
                          src={prohibition}
                          alt="empty"
                          height={224}
                          width={224}
                          className="h-24 w-24 object-cover "
                        />
                        <p className="text-lg text-muted-foreground mt-4 mb-6">
                          ไม่พบโน๊ต
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="comments">
                {/* Comments */}
                <Card className="sm:min-h-96">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                      <CardTitle className="mb-3 sm:mb-0">คอมเมนต์ </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {projectData.comments?.length > 0 ? (
                      projectData.comments?.map((comment, index) => (
                        <div
                          className="flex flex-col items-start py-2 w-full"
                          key={index}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(comment.userName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex justify-between items-center w-full">
                              <p className="font-semibold text-sm sm:text-base">
                                {comment.userName}
                              </p>
                            </div>
                          </div>
                          <div className="prose dark:prose-invert w-full m-0 sm:ml-12">
                            {parse(
                              `<div className="max-w-full break-words my-0">${comment.content}</div>`
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-48">
                        <div className="w-full col-span-full flex flex-col items-center ">
                          <Image
                            src={noSpeak}
                            alt="empty"
                            height={224}
                            width={224}
                            className="h-24 w-24 object-cover "
                          />
                          <p className="text-lg text-muted-foreground mt-4 mb-6">
                            ไม่พบคอมเมนต์
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="md:col-span-2 space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลโครงการ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1  pb-4">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">ช่วงเวลา:</span>
                  </div>
                  <div className="pl-7 space-y-1 flex items-start justify-start flex-col xl:flex-row xl:justify-between">
                    <p className="text-sm ">
                      เริ่ม: {moment(projectData?.startDate).format("LL")}
                    </p>
                    <p className="text-sm ">
                      สิ้นสุด: {moment(projectData?.endDate).format("LL")}
                    </p>
                  </div>
                  <div className="pl-7 text-sm flex">
                    สถานะ:{" "}
                    <div
                      className={` font-medium ml-2 ${
                        daysDifference <= 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {projectData?.endDate
                        ? formatDaysDifference(daysDifference)
                        : "กำลังดําเนินการ"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Client Details */}
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดผู้ดูแล</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-2 sm:mb-4  ">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                    <div>
                      <p className="font-semibold">
                        {projectData?.user?.name || "ยังไม่ได้ระบุ"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        บริษัท{" "}
                        {projectData?.user?.companyName || "ยังไม่ได้ระบุ"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>อีเมล: </strong>
                    {projectData?.user?.email}
                  </p>
                  <p>
                    <strong>เบอร์โทร: </strong>
                    {projectData?.user?.phone}
                  </p>
                  <p>
                    <strong>ที่อยู่: </strong>
                    {projectData?.user?.location}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Domains Card */}
            <PublicProjectDomainsCard projectData={projectData} />
          </div>
        </div>
      </div>
    </div>
  );
}
