"use client";
import { Eye, EyeOff, Headset, Loader2, Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserProps } from "@/types/types";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { createUser } from "@/actions/users";
import TextInput from "../FormInputs/TextInput";
import PasswordInput from "../FormInputs/PasswordInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { createUser } from "@/actions/users";
import { signIn } from "next-auth/react";
export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserProps>();
  const router = useRouter();
  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.name = `${data.firstName} ${data.lastName}`;
    data.image =
      "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
    try {
      const res = await createUser(data);
      if (res.status === 409) {
        setLoading(false);
        setEmailErr(res.error);
      } else if (res.status === 200) {
        setLoading(false);
        toast.success("สร้างบัญชีสําเร็จ");
        router.push("/login");
      } else {
        setLoading(false);
        toast.error("เกิดข้อผิดพลาดในการสร้างบัญชี");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong, try again");
    }
  }
  return (
    <div className="w-full py-5 lg:px-8 px-6">
      <div className="">
        <div className="py-4 text-zinc-900">
          <h2 className="text-xl lg:text-2xl font-bold leading-9 tracking-tight  ">
            สร้างบัญชีผู้ใช้
          </h2>
          <p className="text-xs">
            เข้าร่วมกับเรา กรอกรายละเอียดเพื่อสร้างบัญชีผู้ใช้
          </p>
        </div>
      </div>
      <div className="">
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="ชื่อ"
              name="firstName"
              icon={User}
              placeholder="ชื่อ"
            />
            <TextInput
              register={register}
              errors={errors}
              label="นามสกุล"
              name="lastName"
              icon={User}
              placeholder="นามสกุล"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              register={register}
              errors={errors}
              label="เบอร์โทรศัพท์"
              name="phone"
              icon={Headset}
              placeholder="เบอร์โทรศัพท์"
            />
            <div className="">
              <TextInput
                type="email"
                register={register}
                errors={errors}
                label="อีเมล"
                name="email"
                icon={Mail}
                placeholder="อีเมล"
              />
              {emailErr && (
                <p className="text-red-500 text-xs mt-2">{emailErr}</p>
              )}
            </div>
          </div>

          <PasswordInput
            register={register}
            errors={errors}
            label="รหัสผ่าน"
            name="password"
            icon={Lock}
            placeholder="รหัสผ่าน"
            type="password"
          />
          <div>
            <SubmitButton
              title="สร้างบัญชี"
              loadingTitle="กำลังสร้างบัญชี..."
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Button
            onClick={() => signIn("google")}
            variant={"outline"}
            className="w-full"
          >
            <FaGoogle className="mr-2 w-6 h-6 text-red-500" />
            Signup with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            variant={"outline"}
            className="w-full"
          >
            <FaGithub className="mr-2 w-6 h-6 text-zinc-900 dark:text-white" />
            Signup with Github
          </Button>
        </div>

        <p className=" text-center text-sm text-zinc-500">
          มีบัญชีผู้ใช้อยู่แล้ว?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
