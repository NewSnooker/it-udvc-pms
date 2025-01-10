"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../FormInputs/TextInput";
import { changeUserPasswordById } from "@/actions/users";
import { Info, KeyRound, Lock, User as UserIcon } from "lucide-react";
import { User } from "@prisma/client";
import PasswordInput from "../FormInputs/PasswordInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SubmitButton from "../FormInputs/SubmitButton";
import CloseButton from "../FormInputs/CloseButton";

export type PasswordProps = {
  oldPassword: string;
  newPassword: string;
};
export type SelectOptionProps = {
  label: string;
  value: string;
};
type ChangPasswordFormProps = {
  editingId?: string | undefined;
  initialData?: User | undefined | null;
};
export default function ChangPasswordForm({
  editingId,
  initialData,
}: ChangPasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordProps>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const [passErr, setPassErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(data: PasswordProps) {
    setLoading(true);
    try {
      if (editingId) {
        const res = await changeUserPasswordById(editingId, data);
        if (res?.status === 403) {
          setLoading(false);
          setPassErr(res?.error || "เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน");
          return;
        }
        if (res?.status === 404) {
          setLoading(false);
          setPassErr(res?.error || "เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน");
          return;
        }
        if (res?.status === 200) {
          setLoading(false);
          setPassErr("");
          toast.success("อัปเดตรหัสผ่านสำเร็จ!");
          reset();
          return;
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("เกิดข้อผิดพลาดบางอย่าง!");
    }
  }
  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>เปลี่ยนรหัสผ่านใหม่</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="space-y-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="รหัสผ่านเดิม"
                  name="oldPassword"
                  icon={KeyRound}
                  placeholder="กรอกรหัสผ่านเดิม"
                />
                <PasswordInput
                  register={register}
                  errors={errors}
                  label="รหัสผ่านใหม่"
                  name="newPassword"
                  icon={Lock}
                  placeholder="กรอกรหัสผ่านใหม่"
                  forgotPasswordLink="/forgot-password"
                />
                {passErr && <p className="text-red-500 text-xs">{passErr}</p>}

                <div className="flex items-center gap-2 justify-between ">
                  <CloseButton href="/" />
                  <SubmitButton
                    title="เปลี่ยนรหัสผ่าน"
                    loading={loading}
                    buttonIcon={Lock}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full grid gap-2 sm:gap-6">
          {" "}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle className="font-bold">หมายเหตุ:</AlertTitle>
            <AlertDescription>
              หากคุณเข้าสู่ระบบด้วย <b>Google</b> หรือ <b>GitHub</b> คุณจะ
              <span className="text-red-600 dark:text-red-500">
                {" "}
                ไม่สามารถเปลี่ยนรหัสผ่าน
              </span>{" "}
              ในหน้านี้ เนื่องจากระบบใช้การตรวจสอบสิทธิ์ผ่านผู้ให้บริการดังกล่าว
            </AlertDescription>
          </Alert>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle className="font-bold">
              คำแนะนำการตั้งรหัสผ่าน:
            </AlertTitle>
            <AlertDescription className="text-sm">
              <ul className="list-disc list-inside space-y-1">
                <li>รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</li>
                <li>
                  ต้องประกอบด้วย <b>ตัวอักษร</b> และ <b>ตัวเลข</b>{" "}
                  อย่างน้อยอย่างละ 1 ตัว
                </li>
                <li>
                  หลีกเลี่ยงการใช้รหัสผ่านเดิมหรือรหัสผ่านที่คาดเดาได้ง่าย
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </form>
  );
}
