"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { UserProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { createUser, updateUserById } from "@/actions/users";
import PasswordInput from "../FormInputs/PasswordInput";
import {
  Building,
  Flag,
  Headset,
  Lock,
  Mail,
  MapPin,
  Pencil,
  User as UserIcon,
} from "lucide-react";
import { User } from "@prisma/client";
import TextArea from "../FormInputs/TextAreaInput";

type AccountFormProps = {
  id: string;
  initialData?: User | undefined | null;
};
export default function AccountForm({ initialData, id }: AccountFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      location: initialData?.location || "",
      companyName: initialData?.companyName || "",
      companyDescription: initialData?.companyDescription || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const initialImage =
    initialData?.image ||
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(initialImage);
  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.name = `${data.firstName} ${data.lastName}`;
    data.image = imageUrl;
    try {
      const res = await updateUserById(id, data);
      if (res?.status === 409) {
        setLoading(false);
        setEmailErr("อีเมลนี้ถูกใช้ไปแล้ว");
        return;
      }
      if (res?.status === 404) {
        setLoading(false);
        setEmailErr("ไม่พบไอดีผู้ใช้");
        return;
      }
      setEmailErr(null);
      setLoading(false);
      toast.success("อัปเดตบัญชีสำเร็จ!");
      reset();
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("เกิดข้อผิดพลาดบางอย่าง!");
    }
  }
  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="บัญชี" editingId={id} />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>บัญชี</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="ชื่อ"
                  name="firstName"
                  icon={UserIcon}
                  placeholder="กรอกชื่อ"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="นามสกุล"
                  name="lastName"
                  icon={UserIcon}
                  placeholder="กรอกนามสกุล"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  icon={Headset}
                  placeholder="กรอกเบอร์โทร"
                />
                <div className="">
                  <TextInput
                    type="email"
                    register={register}
                    errors={errors}
                    label="อีเมล"
                    name="email"
                    icon={Mail}
                    placeholder="กรอกอีเมล"
                  />
                  {emailErr && (
                    <p className="text-red-500 text-xs mt-2">{emailErr}</p>
                  )}
                </div>
                <TextInput
                  register={register}
                  errors={errors}
                  label="ที่อยู่"
                  name="location"
                  icon={MapPin}
                  placeholder="กรอกที่อยู่"
                />
              </div>

              <TextInput
                register={register}
                errors={errors}
                label="ชื่อบริษัท"
                name="companyName"
                icon={Building}
                placeholder="กรอกชื่อบริษัท"
              />
              <TextArea
                register={register}
                errors={Pencil}
                label="รายละเอียดบริษัท"
                name="companyDescription"
                // icon={MapPin}
                placeholder="กรอกรายละเอียดบริษัท"
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="รูปภาพโปรไฟล์"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="clientProfileImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/"
        editingId={id}
        loading={loading}
        title="บัญชี"
        parent=""
      />
    </form>
  );
}
