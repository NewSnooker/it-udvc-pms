/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import emptyFolder from "@/public/images/empty-folder.png";
import noSpeak from "@/public/images/no-speak.png";
import prohibition from "@/public/images/prohibition.png";
import report from "@/public/images/report.png";
import receipt from "@/public/images/receipt.png";
import moment from "moment";
import "moment/locale/th";
moment.locale("th");
import parse from "html-react-parser";
import {
  CalendarDays,
  Banknote,
  Edit,
  Users,
  ArrowLeft,
  X,
  LogOut,
  Eye,
} from "lucide-react";

import Link from "next/link";
import { ExistingUsers, ProjectData } from "@/types/types";
import DescriptionForm from "@/components/Forms/DescriptionForm";
import NotesForm from "@/components/Forms/NotesForm";
import ProjectBanner from "./ProjectBanner";
import { ModeToggle } from "@/components/mode-toggle";
import AuthenticatedAvatar from "@/components/global/AuthenticatedAvatar";
import { Session } from "next-auth";
import PaymentForm from "@/components/Forms/PaymentForm";
import { Badge } from "@/components/ui/badge";
import BudgetProgressBar from "./BudgetProgressBar";
import CommentForm from "@/components/Forms/CommentForm";
import { getInitials } from "@/lib/generateInitials";
import ModuleForm from "@/components/Forms/ModuleForm";
import InviteClient from "../DataTableColumns/InviteClient";
import { UserRole } from "@prisma/client";
import LogoutBtn from "../global/LogoutBtn";
import InviteMembers from "./InviteMembers";
import ProjectDomainsCard from "./ProjectDomainsCard";
import PaymentDeleteButton from "./PaymentDeleteButton";
import { useSearchParams } from "next/navigation";

export default function ProjectDetailsPage({
  projectData,
  existingUsers,
  session,
}: {
  projectData: ProjectData;
  existingUsers: ExistingUsers[];
  session: Session | null;
}) {
  const searchParams = useSearchParams();
  const user = session?.user;
  let role = user?.role;
  // if (user.id !== projectData.user?.id) {
  //   role = UserRole.MEMBER;
  // }
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [daysDifference, setDaysDifference] = useState(0);
  const [currentTab, setCurrentTab] = useState("modules");

  useEffect(() => {
    // ตรวจสอบค่าจาก URL หรือพารามิเตอร์ query
    const tab = searchParams.get("tab");
    if (tab && tabs.some((t) => t.value === tab)) {
      setCurrentTab(tab); // ตั้งค่าตามพารามิเตอร์
    }
  }, [searchParams]); // ใช้ searchParams ใน dependency array เพื่อให้ตรวจสอบทุกครั้งที่ URL เปลี่ยน

  const tabs = [
    { value: "modules", label: "ฟังค์ชั่นโครงการ" },
    { value: "notes", label: "โน๊ต" },
    { value: "comments", label: "คอมเมนต์" },
    {
      value: "invoicesAndPayments",
      label: "การชำระเงิน",
      mobileLabel: "และใบแจ้งหนี้",
    },
  ];
  const paidAmount = projectData.payments.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);
  const remainingAmount = projectData.budget
    ? projectData.budget - paidAmount
    : 0;
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
  const handleFormClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
  };

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
        <div className="mb-4 flex items-center justify-between w-full">
          <div className="flex items-center w-full justify-between sm:justify-start">
            <Avatar>
              <AvatarImage
                src={projectData.thumbnail ?? ""}
                alt={projectData.name}
              />
              <AvatarFallback>
                <Image
                  src="/thumbnail.png"
                  alt="/thumbnail.png"
                  width={40}
                  height={40}
                />
              </AvatarFallback>
            </Avatar>

            <div className=" hidden lg:block ml-4">
              <h2 className="text-sm sm:text-xl font-semibold">
                {projectData.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center lg:flex-1 lg:justify-end space-x-2">
            <ModeToggle />
            <AuthenticatedAvatar session={session} />
          </div>
        </div>
        {/* Banner */}
        <ProjectBanner
          editingId={projectData.id}
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
                <Button
                  onClick={() => setIsEditingDesc(!isEditingDesc)}
                  variant="ghost"
                  size="icon"
                >
                  {!isEditingDesc ? (
                    <Edit className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                {!isEditingDesc ? (
                  <p>{projectData.description}</p>
                ) : (
                  <DescriptionForm
                    editingId={projectData.id}
                    initialDescription={projectData.description}
                    setIsEditingDesc={setIsEditingDesc}
                  />
                )}
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
                    href={`/project/${projectData.slug}?tab=${tab.value}`}
                    scroll={false}
                    shallow
                    className="w-full"
                  >
                    <TabsTrigger value={tab.value} className="w-full">
                      {tab.label}
                      {tab.mobileLabel && (
                        <span className="hidden sm:inline">
                          {" "}
                          {tab.mobileLabel}
                        </span>
                      )}
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
                      <ModuleForm
                        projectId={projectData.id}
                        userId={user.id}
                        userName={user.name}
                      />
                    </div>
                  </CardHeader>

                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6 w-full ">
                      {projectData.modules.length > 0 ? (
                        projectData.modules.map((module, index) => (
                          <Link
                            href={`/project/modules/${module.id}?pid=${module.projectId}`}
                            key={index}
                          >
                            <div className="h-fit group transition-all ease-in-out">
                              <div className="text-sm w-full flex items-center justify-between shadow-md bg-zinc-100 dark:bg-background dark:border dark:hover:border-none cursor-pointer px-4 pr-2 sm:px-6 sm:pr-4 py-4 rounded-lg hover:shadow-none">
                                <span>{module.name}</span>
                                <div
                                  className="sm:opacity-0 group-hover:sm:opacity-100 transition-all"
                                  onClick={(event) => handleFormClick(event)}
                                >
                                  <ModuleForm
                                    projectId={projectData.id}
                                    userId={user.id}
                                    userName={user.name}
                                    initialModule={module.name}
                                    editingId={module.id}
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
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
                    <Button
                      onClick={() => setIsEditingNotes(!isEditingNotes)}
                      variant="ghost"
                      size="icon"
                    >
                      {!isEditingNotes ? (
                        <Edit className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {!isEditingNotes ? (
                      <>
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
                      </>
                    ) : (
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
                        isEditingNotes={true}
                      />
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
                      <CommentForm
                        projectId={projectData.id}
                        userId={user.id}
                        userName={user.name}
                        userRole={user.role}
                      />
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
                              <CommentForm
                                projectId={projectData.id}
                                userId={user.id}
                                userName={user.name}
                                userRole={user.role}
                                editingId={comment.id}
                                initialContent={comment.content}
                              />
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
              <TabsContent value="invoicesAndPayments">
                {/* Invoices & Payments */}
                <Card className="sm:min-h-96">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                      <CardTitle className="mb-3 sm:mb-0">
                        การชำระเงินและใบแจ้งหนี้{" "}
                      </CardTitle>
                      {role === UserRole.USER && (
                        <PaymentForm
                          projectId={projectData.id}
                          userId={projectData.userId ?? ""}
                          clientId={projectData.clientId ?? ""}
                          remainingAmount={remainingAmount}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="">
                    <Tabs defaultValue="payments" className="w-full">
                      <TabsList className="w-full mb-2">
                        <TabsTrigger className="w-full" value="payments">
                          การชำระเงิน
                        </TabsTrigger>
                        <TabsTrigger className="w-full" value="invoices">
                          ใบแจ้งหนี้
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="payments">
                        {projectData.payments.length > 0 ? (
                          projectData.payments.map((payment, index) => (
                            <div className="mt-2" key={index}>
                              <Card className="flex items-center gap-2 py-2 px-4 cursor-default w-full text-sm">
                                <div className="flex items-center justify-between gap-2 w-full  ">
                                  <div className="hidden sm:flex flex-col justify-start items-start ">
                                    <div className="text-sm">
                                      {moment(payment.date).format("L")}
                                    </div>
                                  </div>

                                  <div className="line-clamp-1">
                                    {payment.title}{" "}
                                  </div>
                                  <Badge className="bg-green-400 dark:bg-green-500 text-zinc-900 hover:bg-green-300 dark:hover:bg-green-400">
                                    ฿{payment.amount.toLocaleString()}
                                  </Badge>
                                </div>
                                {/* Delete Button */}
                                <PaymentDeleteButton paymentId={payment.id} />
                              </Card>
                            </div>
                          ))
                        ) : (
                          <div className="w-full col-span-full flex flex-col items-center pt-6 ">
                            <Image
                              src={receipt}
                              alt="empty"
                              height={224}
                              width={224}
                              className="h-24 w-24 object-cover "
                            />
                            <p className="text-lg text-muted-foreground mt-4 mb-6">
                              ไม่พบการชำระเงิน
                            </p>
                          </div>
                        )}
                        <div className="mt-6">
                          {projectData.budget && (
                            <BudgetProgressBar
                              budget={projectData.budget ?? 0}
                              paidAmount={paidAmount ?? 0}
                            />
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="invoices" className="w-full">
                        {projectData.payments.length > 0 ? (
                          projectData.payments.map((invoice, index) => (
                            <div className="mt-2" key={index}>
                              <Card className="flex items-center gap-2 py-2 px-4 cursor-default w-full text-sm">
                                <div className="flex items-center justify-between gap-2 w-full">
                                  <div className="flex flex-col justify-start items-start">
                                    <span className="text-xs">
                                      #{invoice.invoiceNumber}
                                    </span>
                                    <div className="text-xs text-muted-foreground">
                                      {moment(invoice.date).format("L")}
                                    </div>
                                  </div>

                                  <div className="line-clamp-1 hidden sm:flex">
                                    {invoice.title}{" "}
                                  </div>
                                  <Badge className="bg-green-400 dark:bg-green-500 text-zinc-900 hover:bg-green-300 dark:hover:bg-green-400">
                                    ฿{invoice.amount.toLocaleString()}
                                  </Badge>
                                </div>
                                <Link
                                  href={`/project/invoice/${invoice.id}?project=${projectData.slug}`}
                                >
                                  <Button variant="outline" size={"sm"}>
                                    <Eye className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                      ดูใบแจ้งหนี้
                                    </span>
                                  </Button>
                                </Link>
                              </Card>
                            </div>
                          ))
                        ) : (
                          <div className="w-full col-span-full flex flex-col items-center pt-6 ">
                            <Image
                              src={report}
                              alt="empty"
                              height={224}
                              width={224}
                              className="h-24 w-24 object-cover "
                            />
                            <p className="text-lg text-muted-foreground mt-4 mb-6">
                              ไม่พบใบแจ้งหนี้
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
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
                <div className="space-y-1 border-b pb-4">
                  <div className="flex items-center space-x-2">
                    <Banknote className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">ค่าใช้จ่าย:</span>
                  </div>
                  <div className="pl-7 space-y-1 flex items-start justify-start flex-col xl:flex-row xl:justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">จ่ายแล้ว:</span>
                      <span className="font-bold text-sm mr-2">
                        {paidAmount?.toLocaleString() || "N/A"}
                      </span>
                      <span>บาท</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">งบประมาณ:</span>
                      <span className="font-bold text-sm mr-2">
                        {projectData.budget?.toLocaleString() || "N/A"}
                      </span>
                      <span>บาท</span>
                    </div>{" "}
                  </div>
                </div>

                <div className="space-y-1 border-b pb-4">
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
                {role === UserRole.USER && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                      <Users className="h-5 w-5 text-purple-400" />
                      <span className="font-medium">สมาชิก:</span>
                    </div>
                    <div className=" flex -space-x-2">
                      <div className="w-full">
                        <InviteMembers
                          existingUsers={existingUsers.filter(
                            (member) => member.id !== user.id
                          )}
                          projectData={projectData}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Client Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  รายละเอียด{role === UserRole.CLIENT ? "ผู้ดูแล" : "ลูกค้า"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-2 sm:mb-4  ">
                  {role === UserRole.USER ? (
                    <Avatar className="h-10 w-10 ">
                      <AvatarImage
                        src={projectData?.client?.image ?? "/placeholder.svg"}
                        alt="Space Corp"
                      />
                      <AvatarFallback>
                        {projectData?.client?.name
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar className="h-10 w-10 ">
                      <AvatarImage
                        src={projectData?.user?.image ?? "/placeholder.svg"}
                        alt="Space Corp"
                      />
                      <AvatarFallback>
                        {projectData?.user?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {role === UserRole.USER ? (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                      <div>
                        <p className="font-semibold">
                          {projectData?.client?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          บริษัท{" "}
                          {projectData?.client?.companyName || "ยังไม่ได้ระบุ"}
                        </p>
                      </div>
                      <div className="">
                        <InviteClient row={projectData} />
                      </div>
                    </div>
                  ) : (
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
                  )}
                </div>
                {role === UserRole.USER ? (
                  <div className="space-y-1">
                    <p>
                      <strong>อีเมล: </strong>
                      {projectData?.client?.email}
                    </p>
                    <p>
                      <strong>เบอร์โทร: </strong>
                      {projectData?.client?.phone}
                    </p>
                    <p>
                      <strong>ที่อยู่: </strong>
                      {projectData?.client?.location}
                    </p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
            {/* Domains Card */}
            <ProjectDomainsCard projectData={projectData} />
          </div>
        </div>
      </div>
    </div>
  );
}
