"use client";
import React, { useState } from "react";
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
import {
  CalendarDays,
  Banknote,
  Edit,
  MessageSquare,
  Users,
  ArrowLeft,
  X,
  PlusCircle,
  HandCoins,
} from "lucide-react";

import Link from "next/link";
import { ProjectData } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import DescriptionForm from "@/components/Forms/DescriptionForm";
import NotesForm from "@/components/Forms/NotesForm";
import ProjectBanner from "./ProjectBanner";
import { ModeToggle } from "@/components/mode-toggle";
import AuthenticatedAvatar from "@/components/global/AuthenticatedAvatar";
import { Session } from "next-auth";
import PaymentForm from "@/components/Forms/PaymentForm";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ProjectDetailsPage({
  projectData,
  session,
}: {
  projectData: ProjectData;
  session: Session | null;
}) {
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const paidAmount = projectData.payments.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);
  const remainingAmount = projectData.budget
    ? projectData.budget - paidAmount
    : 0;
  return (
    <div className=" bg-zinc-100 dark:bg-zinc-950">
      <div className="container mx-auto p-4 space-y-6">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/dashboard/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปยังหน้าโครงการ
            </Button>
          </Link>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-2">
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
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="md:col-span-5 space-y-6">
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
                  <ScrollArea className="h-48">
                    <p>{projectData.description}</p>
                  </ScrollArea>
                ) : (
                  <DescriptionForm
                    editingId={projectData.id}
                    initialDescription={projectData.description}
                    setIsEditingDesc={setIsEditingDesc}
                  />
                )}
              </CardContent>
            </Card>
            {/* Notes */}
            <Card>
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
                    {projectData.notes ? (
                      <NotesForm
                        editingId={projectData.id}
                        initialNotes={JSON.parse(projectData.notes ?? "")}
                        // initialNotes={projectData.notes}
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
                    initialNotes={JSON.parse(projectData.notes ?? "")}
                    // initialNotes={projectData.notes}
                    setIsEditingNotes={setIsEditingNotes}
                    isEditingNotes={true}
                  />
                )}
              </CardContent>
            </Card>
            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>คอมเมนต์</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 space-y-2 mb-5">
                  <>
                    {projectData.comments?.length > 0 ? (
                      projectData.comments?.map((comment, index) => (
                        <div className="flex items-start space-x-4" key={index}>
                          <Avatar>
                            <AvatarImage
                              src="/placeholder.svg"
                              alt="John Doe"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">John Doe</p>
                            <p className="text-sm text-muted-foreground">
                              Great progress on the propulsion systems!
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
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
                    )}
                  </>
                </ScrollArea>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" /> ส่งคอมเมนต์
                </Button>
              </CardContent>
            </Card>

            {/* Project Modules */}
            <Card>
              <CardHeader>
                <CardTitle>เกณฑ์ในการวัดโครงการ</CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {projectData.modules.length > 0 ? (
                  projectData.modules.map((module, index) => (
                    <div
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="text-lg">{module.name}</div>
                        <p className="text-sm text-muted-foreground">
                          {module.projectId}
                        </p>
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
                      ไม่พบเกณฑ์ในการวัด
                    </p>
                    <Button>เพิ่มเกณฑ์ในการวัด</Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="">
              <CardHeader>
                <CardTitle>ข้อมูลโครงการ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="">
                  <div className="flex items-center space-x-2">
                    <Banknote className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">งบประมาณ:</span>
                    <span className="font-bold text-sm mr-2">
                      {projectData.budget?.toLocaleString() || "N/A"}
                    </span>
                    <span>บาท</span>
                  </div>{" "}
                  <div className="flex items-center space-x-2">
                    <HandCoins className="h-5 w-5 text-green-500" />
                    <span className="font-medium">จ่ายแล้ว:</span>
                    <span className="font-bold text-sm mr-2">
                      {paidAmount?.toLocaleString() || "N/A"}
                    </span>
                    <span>บาท</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">ช่วงเวลา:</span>
                  </div>
                  <div className="pl-7 space-y-1">
                    <p className="text-sm ">
                      เริ่ม: {moment(projectData?.startDate).format("LL")}
                    </p>
                    <p className="text-sm ">
                      สิ้นสุด: {moment(projectData?.endDate).format("LL")}
                    </p>
                    <p className="text-sm ">
                      เป็นเวลา: {projectData?.deadline} วัน
                    </p>
                    {/* <p className="text-sm text-muted-foreground">
                      เหลือเวลา: {projectData?.deadline} วัน
                    </p> */}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    <span className="font-medium">สมาชิก:</span>
                  </div>
                  <div className="pl-7 flex -space-x-2">
                    {projectData.members.length > 0 ? (
                      projectData.members.map((member, index) => (
                        <Avatar
                          key={index}
                          className="h-8 w-8 border-2 border-background"
                        >
                          <AvatarFallback>
                            {member.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ))
                    ) : (
                      <div className="">
                        <Button variant="outline" size={"sm"}>
                          <PlusCircle className="w-4 h-4 mr-1.5" />
                          เชิญ
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Details */}
            <Card>
              <CardHeader>
                <CardTitle>รายละเอียดลูกค้า</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <div className="flex items-center space-x-4 mb-2 ">
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
                    <div>
                      <p className="font-semibold">
                        {projectData?.client?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        บริษัท{" "}
                        {projectData?.client?.companyName || "ยังไม่ได้ระบุ"}
                      </p>
                    </div>
                  </div>
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
                </ScrollArea>
              </CardContent>
            </Card>
            {/* Invoices & Payments */}
            <Card>
              <CardHeader>
                <CardTitle>ใบแจ้งหนี้และการชำระเงิน</CardTitle>
              </CardHeader>
              <CardContent className="">
                <Tabs defaultValue="payments" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger className="w-full" value="payments">
                      การชำระเงิน
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="invoices">
                      ใบแจ้งหนี้
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="payments">
                    <div className="space-y-2 w-full">
                      <PaymentForm
                        projectId={projectData.id}
                        userId={projectData.userId ?? ""}
                        clientId={projectData.clientId ?? ""}
                        remainingAmount={remainingAmount}
                      />
                    </div>

                    <ScrollArea className="h-52">
                      {projectData.payments.length > 0 ? (
                        projectData.payments.map((payment, index) => (
                          <div className="mt-2" key={index}>
                            <Button
                              variant="outline"
                              className="flex items-center justify-between gap-2 py-2 px-4  w-full text-sm"
                            >
                              <div className="">
                                {moment(payment.date).format("L")}{" "}
                              </div>

                              <div className="line-clamp-1">
                                {payment.title}{" "}
                              </div>
                              <Badge className="bg-green-400 dark:bg-green-500 text-zinc-900 hover:bg-green-300 dark:hover:bg-green-400">
                                ฿{payment.amount.toLocaleString()}
                              </Badge>
                            </Button>
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
                    </ScrollArea>
                    <Progress value={33} />
                  </TabsContent>
                  <TabsContent value="invoices" className="w-full">
                    <ScrollArea className="h-52 ">
                      {projectData.payments.length > 0 ? (
                        projectData.payments.map((invoice, index) => (
                          <div className="mt-2" key={index}>
                            <Link
                              href={`/project/invoice/${invoice.id}?project=${projectData.slug}`}
                            >
                              <Button
                                variant="outline"
                                className="flex items-center justify-between gap-2 py-2 px-4  w-full text-sm"
                              >
                                <div className="flex flex-col justify-start items-start">
                                  <span className="text-xs">
                                    #{invoice.invoiceNumber}
                                  </span>
                                  <div className="text-xs text-muted-foreground">
                                    {moment(invoice.date).format("L")}
                                  </div>
                                </div>

                                <div className="line-clamp-1">
                                  {invoice.title}{" "}
                                </div>
                                <Badge className="bg-green-400 dark:bg-green-500 text-zinc-900 hover:bg-green-300 dark:hover:bg-green-400">
                                  ฿{invoice.amount}
                                </Badge>
                              </Button>
                            </Link>
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
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
