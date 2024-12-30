"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Info, Loader, Mail, Paperclip, Send, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import * as React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Subscriber, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormSelectInput from "../FormInputs/FormSelectInput";
import { AuthUser } from "@/config/getAuthUser";
import { deleteFileUploadthing } from "@/actions/fileManager";
import { FileProps, getFileIcon } from "../FormInputs/MultipleFileUpload";
import MultipleImageInputPropsEmailCompose from "../FormInputs/MultipleFileUploadEmailCompose";
import TextInput from "../FormInputs/TextInput";
import { sendSingleEmail } from "@/actions/emails";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const QuillEditor = dynamic(
  () => import("@/components/FormInputs/QuillEditor"),
  { ssr: false }
);

export type MailProps = {
  name: string;
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments: FileProps[];
};

interface EmailComposeProps {
  clients: User[];
  subscribers: Subscriber[];
  user: AuthUser;
}

export default function EmailCompose({
  clients,
  subscribers,
  user,
}: EmailComposeProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MailProps>({
    defaultValues: {
      from: user.email,
      subject: "",
    },
  });
  const router = useRouter();
  const mailListSubs =
    subscribers?.map((item) => ({
      value: item.email,
      label: item.email + " - " + "ผู้ติดตาม",
    })) || [];

  const mailListClients =
    clients?.map((item) => ({
      value: item.email,
      label: item.email + " - " + "ลูกค้า",
    })) || [];

  const allPeople = [{ value: "all-people", label: "@ทุกคน" }];
  const allClients = [{ value: "all-clients", label: "@ลูกค้าทั้งหมด" }];
  const allSubs = [{ value: "all-subs", label: "@ผู้ติดตามทั้งหมด" }];

  const allEmails = [
    ...allPeople,
    ...(mailListClients.length > 0 ? allClients : []), // เพิ่มเฉพาะถ้ามีข้อมูล
    ...(mailListSubs.length > 0 ? allSubs : []), // เพิ่มเฉพาะถ้ามีข้อมูล
    ...mailListClients,
    ...mailListSubs,
  ];

  const [selectedRecipients, setSelectedRecipients] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileProps[]>([]);
  const [content, setContent] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  async function handleImageRemove(key: string) {
    try {
      const updatedFiles = files.filter((file) => file.key !== key);
      await deleteFileUploadthing(key);
      setFiles(updatedFiles);
    } catch (error) {
      console.error("UTAPI: Error deleting files", error);
      toast.error("เกิดข้อผิดพลาดในการลบไฟล์!");
    }
  }

  async function onSubmit(data: MailProps) {
    setIsLoading(true);

    // ตรวจสอบว่าเนื้อหาและผู้รับครบถ้วนหรือไม่
    if (!content || content.trim() === "" || content.trim() === "<p><br></p>") {
      setIsLoading(false);
      toast.error("กรุณากรอกเนื้อหา");
      return;
    }

    if (!selectedRecipients) {
      setIsLoading(false);
      toast.error("กรุณาเลือกผู้รับ");
      return;
    }

    // กำหนดค่าข้อมูลส่งอีเมล
    data.name = user.name || "";
    data.html = content;
    data.attachments = files || [];
    data.to = selectedRecipients.value;

    // ตรวจสอบประเภทของผู้รับ
    if (data?.to === "all-subs") {
      if (mailListSubs.length > 0) {
        data.to = mailListSubs.map((item) => item.value).join(",");
      } else {
        setIsLoading(false);
        toast.error("ไม่มีรายชื่อผู้ติดตามในระบบ");
        return;
      }
    } else if (data?.to === "all-clients") {
      if (mailListClients.length > 0) {
        data.to = mailListClients.map((item) => item.value).join(",");
      } else {
        setIsLoading(false);
        toast.error("ไม่มีรายชื่อลูกค้าในระบบ");
        return;
      }
    } else if (data?.to === "all-people") {
      const validEmails = [...mailListSubs, ...mailListClients].map(
        (item) => item.value
      );
      if (validEmails.length > 0) {
        data.to = validEmails.join(",");
      } else {
        setIsLoading(false);
        toast.error("ไม่มีรายชื่อผู้รับในระบบ");
        return;
      }
    }

    try {
      const res = await sendSingleEmail(data);
      if (res?.status === 200) {
        setIsLoading(false);
        toast.success("ส่งอีเมลสําเร็จ!");
        setOpen(false);
        reset();
        setFiles([]);
        setContent("");
        setSelectedRecipients(null);
      } else {
        console.error(res.error);
        setIsLoading(false);
        toast.error("เกิดข้อผิดพลาดในการส่งอีเมล!");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("เกิดข้อผิดพลาดในการส่งอีเมล!");
      console.error(error);
    }
  }

  return (
    <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 p-8">
      <Card className="lg:col-span-8 col-span-full space-y-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="w-full border-b ">
            <div className="flex items-center justify-center gap-2 sm:justify-between ">
              <h2 className="text-2xl font-bold hidden sm:block">อีเมล</h2>
              <Mail className="h-10 w-10 sm:h-6 sm:w-6 " />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div
                className={`flex ${
                  errors.from ? "items-start" : "items-center"
                } space-x-2 w-full`}
              >
                <Label className="min-w-[3rem] ">จาก</Label>
                <div className="flex-1 w-full">
                  <TextInput
                    register={register}
                    errors={errors}
                    name="from"
                    placeholder="พิมที่นี่..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label className="min-w-[3rem]">ถึง</Label>
                  <div className="flex-1">
                    <FormSelectInput
                      label="เลือกผู้รับ"
                      options={allEmails}
                      option={selectedRecipients}
                      setOption={setSelectedRecipients}
                      toolTipText="เพิ่มลูกค้า"
                      labelShown={false}
                      href="/dashboard/clients/new"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`flex ${
                  errors.subject ? "items-start" : "items-center"
                } space-x-2 w-full`}
              >
                <Label className="min-w-[3rem] ">หัวข้อ</Label>
                <div className="flex-1 w-full">
                  <TextInput
                    register={register}
                    errors={errors}
                    name="subject"
                    placeholder="พิมที่นี่..."
                  />
                </div>
              </div>
            </div>
            <QuillEditor
              className="w-full"
              label="เนื้อหา"
              value={content}
              onChange={setContent}
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between border-t pt-5 items-start gap-4">
            <div className="flex flex-col sm:flex-row border-b sm:border-b-0 gap-4 w-full">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    disabled={isLoading}
                    size="sm"
                    className="w-full sm:w-auto flex-shrink-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>อัพโหลดไฟล์ของคุณ</DialogTitle>
                  </DialogHeader>
                  <MultipleImageInputPropsEmailCompose
                    label="เพิ่มไฟล์"
                    files={files}
                    setFiles={setFiles}
                    endpoint="mailAttachment"
                    className="mb-4"
                    setOpen={setOpen}
                  />
                </DialogContent>
              </Dialog>
              <div className="w-full">
                {files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map((file, i) => {
                      const extension = file.title.split(".").pop(); // Extract file extension
                      return (
                        <div key={i} className="relative mb-2">
                          <button
                            type="button"
                            onClick={() => handleImageRemove(file.key)}
                            className="absolute -top-4 -right-2 bg-slate-100 text-red-600 rounded-full p-1 shadow"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <div className="py-2 overflow-hidden rounded-md px-2 bg-white dark:bg-slate-800 text-slate-800 flex items-center dark:text-slate-200 border border-slate-200 shadow-sm">
                            {getFileIcon(extension)}
                            <div className="flex flex-col ml-2">
                              <span className="line-clamp-1">{file.title}</span>
                              {file.size > 0 && (
                                <span className="text-xs text-gray-500">
                                  {(file.size / 1000).toFixed(2)} kb
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex-shrink-0"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="lg:col-span-4 col-span-full grid gap-2 sm:gap-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle className="font-bold">หมายเหตุ:</AlertTitle>
          <AlertDescription>
            การส่งอีเมลต้องปฏิบัติตามเงื่อนไขต่อไปนี้:
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                ต้องระบุ <b>ผู้รับ</b> อย่างน้อย 1 ราย
              </li>
              <li>
                เนื้อหาอีเมล <b>ต้องไม่ว่างเปล่า</b>
              </li>
              <li>
                หากอีเมลที่ระบุ <b>ไม่มีอยู่จริง</b>{" "}
                ระบบจะยกเลิกการส่งทั้งหมดทันที
              </li>
              <li>
                หากต้องการส่งรูปภาพ แนะนำให้แนบเป็นไฟล์ในอีเมล{" "}
                <span className="text-red-600 dark:text-red-500">
                  {" "}
                  ไม่สามารถแทรกรูปภาพในเนื้อหาโดยตรง
                </span>{" "}
              </li>
            </ul>
          </AlertDescription>
        </Alert>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle className="font-bold">คำแนะนำในการเขียนอีเมล:</AlertTitle>
          <AlertDescription className="text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>
                ระบุหัวข้อที่ชัดเจน เช่น <b>แจ้งเตือน</b> หรือ{" "}
                <b>ยืนยันข้อมูล</b>
              </li>
              <li>
                ใช้ภาษาที่เหมาะสมและกระชับ
                เนื้อหาควรสื่อสารข้อมูลสำคัญอย่างตรงประเด็น
              </li>
              <li>
                หากมีเอกสารแนบ ควรตรวจสอบไฟล์แนบให้ครบถ้วนและตรงกับเนื้อหา
              </li>
              <li>
                ใช้โครงสร้าง HTML ที่เรียบง่าย หากจำเป็นต้องส่งอีเมลในรูปแบบ
                HTML
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
