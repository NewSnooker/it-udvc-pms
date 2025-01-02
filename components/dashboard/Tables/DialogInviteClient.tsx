"use client";
import { sendClientInvitationCreateUser } from "@/actions/emails";
import TextInput from "@/components/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { Copy, Loader, Mail, Send } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast as reactToast } from "react-hot-toast";

export type SendClientInvitationCreateUserProps = {
  email: string;
  userId: string;
  invitationLink: string;
};
export default function DialogInviteClient({
  userId,
}: {
  userId: string | null | undefined;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendClientInvitationCreateUserProps>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/clients/new/${userId}`;
  const { toast } = useToast();
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      toast({
        title: "คัดลอกลิงก์เรียบร้อย!",
        description: "ลิงก์ได้ถูกคัดลอกไปยังคลิปบอร์ดของคุณแล้วครับ/ค่ะ",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  async function onSubmit(data: SendClientInvitationCreateUserProps) {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    try {
      data.userId = userId;
      data.invitationLink = invitationLink;
      setIsLoading(true);
      const res = await sendClientInvitationCreateUser(data);
      setIsLoading(false);
      if (res?.status === 200) {
        setIsLoading(false);
        reactToast.success("ส่งอีเมลสําเร็จ!");
        setOpen(false);
        reset();
      } else {
        console.error(res.error);
        setIsLoading(false);
        reactToast.error("เกิดข้อผิดพลาดในการส่งอีเมล!");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Network Error:", error);
      reactToast.error("เกิดข้อผิดพลาดบางอย่าง!");
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="h-8 gap-1">
            <Mail className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              เชิญลูกค้า
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="mb-2 text-lg font-bold ">
              เชิญลูกค้าเข้าร่วมงาน
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              กรุณากรอกอีเมลของลูกค้าที่คุณต้องการเชิญ
              ระบบจะส่งคำเชิญไปยังลูกค้า
              พร้อมลิงก์ให้กรอกข้อมูลในแบบฟอร์มเพื่อยืนยันการเข้าร่วมงาน
              <br />
              <br />
              หรือคุณสามารถ <b>คัดลอกลิงก์นี้และส่งให้ลูกค้าด้วยตนเองได้</b>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <div className="mb-2">
              <TextInput
                type="email"
                register={register}
                errors={errors}
                label="อีเมลลูกค้า"
                name="email"
                placeholder="customer@example.com"
              />
            </div>

            <Label>ลิงก์สําหรับลูกค้า</Label>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
              <Input
                type="text"
                value={invitationLink}
                readOnly
                className="flex-grow"
              />
              <Button type="button" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <DialogFooter className="mt-6">
              <div className="flex justify-between w-full">
                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    ปิด
                  </Button>
                </DialogClose>
                {isLoading ? (
                  <Button variant="default" disabled>
                    <Loader className="h-5 w-5 animate-spin" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="default"
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    ส่งคำเชิญ
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
