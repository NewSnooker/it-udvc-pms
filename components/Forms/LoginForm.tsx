"use client";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { LoginProps } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import TextInput from "../FormInputs/TextInput";
import PasswordInput from "../FormInputs/PasswordInput";
import SubmitButton from "../FormInputs/SubmitButton";
export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LoginProps>();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") || "/dashboard";
  const errorParam = params.get("error");
  const [passErr, setPassErr] = useState("");
  const router = useRouter();
  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true);
      setPassErr("");
      console.log("Attempting to sign in with credentials:", data);
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      console.log("SignIn response:", loginData);
      if (loginData?.error) {
        setLoading(false);
        toast.error(
          "ข้อผิดพลาดในการเข้าสู่ระบบ: กรุณาตรวจสอบข้อมูลรับรองของคุณ"
        );
        setPassErr("ข้อมูลรับรองไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
        // setShowNotification(true);
      } else {
        // Sign-in was successful
        // setShowNotification(false);
        reset();
        setLoading(false);
        toast.success("เข้าสู่ระบบสำเร็จ");
        setPassErr("");
        router.push(returnUrl);
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      // toast.error("Its seems something is wrong with your Network");
    }
  }
  return (
    <div className="w-full py-5 lg:px-8 px-6 ">
      <div className="">
        <div className="py-4 text-zinc-900">
          <h2 className="text-xl lg:text-2xl font-bold leading-9 tracking-tight  ">
            เข้าสู่ระบบ
          </h2>
          <p className="text-xs">
            ยินดีตอนรับกลับ! กรอกรายละเอียดเพื่อเข้าสู่ระบบ{" "}
          </p>
        </div>
      </div>
      <div className="">
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            register={register}
            errors={errors}
            label="อีเมล"
            name="email"
            icon={Mail}
            placeholder="อีเมล"
          />
          <PasswordInput
            register={register}
            errors={errors}
            label="รหัสผ่าน"
            name="password"
            icon={Lock}
            placeholder="รหัสผ่าน"
            forgotPasswordLink="/forgot-password"
          />
          {passErr && <p className="text-red-500 text-xs">{passErr}</p>}
          {errorParam === "OAuthAccountNotLinked" && (
            <p className="text-red-500 text-xs">
              บัญชีไม่ได้เชื่อมโยง กรุณาลงชื่อเข้าใช้ด้วยวิธีที่ถูกต้อง!
            </p>
          )}
          <div>
            <SubmitButton
              title="เข้าสู่ระบบ"
              loadingTitle="กำลังเข้าสู่ระบบ..."
              loading={loading}
              className="w-full"
              loaderIcon={Loader2}
              showIcon={false}
            />
          </div>
        </form>
        <div className="flex items-center py-4 justify-center space-x-1 text-zinc-900">
          <div className="h-[1px] w-full bg-zinc-200"></div>
          <div className="uppercase">Or</div>
          <div className="h-[1px] w-full bg-zinc-200"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => signIn("google")}
            variant={"outline"}
            className="w-full"
          >
            <FaGoogle className="mr-2 w-6 h-6 text-red-500" />
            Login with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            variant={"outline"}
            className="w-full"
          >
            <FaGithub className="mr-2 w-6 h-6 text-zinc-900 dark:text-white" />
            Login with Github
          </Button>
        </div>
        <p className="text-center  text-sm text-zinc-500">
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
