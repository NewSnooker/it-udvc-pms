"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast as reactToast } from "react-hot-toast";
import Link from "next/link";
import TextInput from "./FormInputs/TextInput";
import { Loader, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendForgotPasswordEmail } from "@/actions/emails";

export type SendForgotPasswordEmailProps = {
  email: string;
};

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendForgotPasswordEmailProps>();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: SendForgotPasswordEmailProps) {
    console.log(data);
    try {
      setIsLoading(true);
      const res = await sendForgotPasswordEmail(data);
      if (res?.status === 200) {
        setIsLoading(false);
        reactToast.success("ส่งอีเมลสําเร็จ!");
        reset();
        setTimeout(() => {
          toast({
            variant: "default",
            title: "ส่งอีเมลสําเร็จ!",
            description:
              "โปรดตรวจสอบอีเมลของคุณในกล่องข้อความหรือในโฟลเดอร์สแปมหากไม่พบอีเมลจากเราครับ/ค่ะ",
          });
        }, 1500);
      } else if (res?.status === 404) {
        setIsLoading(false);
        console.log(res);
        reactToast.error("ไม่พบอีเมลนี้ในระบบ!");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className=" text-sm text-muted-foreground">
        กรุณากรอกอีเมลของคุณที่ได้ลงทะเบียนไว้ในระบบ
        ทางเราจะส่งลิงก์เพื่อให้คุณสามารถเปลี่ยนรหัสผ่านได้ผ่านอีเมลของคุณ
      </div>
      <div className="">
        <TextInput
          type="email"
          register={register}
          errors={errors}
          label="อีเมล"
          name="email"
          icon={Mail}
          placeholder="excample@ex.com"
        />
      </div>
      {isLoading ? (
        <Button className="w-full" disabled>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          กำลังส่งลิงก์เปลี่ยนรหัสผ่าน
        </Button>
      ) : (
        <Button className="w-full" type="submit">
          <Mail className="mr-2 h-4 w-4" />
          ส่งลิงก์เปลี่ยนรหัสผ่าน
        </Button>
      )}
      <div className="flex gap-2 justify-center sm:justify-between">
        <p className="  text-[0.75rem] font-light text-muted-foreground">
          คุณจำรหัสผ่านได้แล้วหรือไม่?{" "}
          <Link
            href="/login"
            className="font-medium hover:underline text-blue-500 "
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </form>
  );
}
