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
  Flag,
  Headset,
  Lock,
  Mail,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { User } from "@prisma/client";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ClientFormProps = {
  editingId?: string | undefined;
  initialData?: User | undefined | null;
};
export default function ClientForm({
  editingId,
  initialData,
}: ClientFormProps) {
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
    },
  });
  const router = useRouter();
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
    data.role = "CLIENT";
    try {
      if (editingId) {
        await updateUserById(editingId, data);
        setLoading(false);
        toast.success("อัปเดตลูกค้าสําเร็จ!");
        reset();
        router.push("/dashboard/clients");
      } else {
        const res = await createUser(data);
        if (res.status === 409) {
          setLoading(false);
          setEmailErr(res.error);
        } else if (res.status === 200) {
          setLoading(false);
          toast.success("สร้างลูกค้าสําเร็จ");
          router.push("/dashboard/clients");
        } else {
          setLoading(false);
          toast.error("เกิดข้อผิดพลาดในการสร้างลูกค้า");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("เกิดข้อผิดพลาดบางอย่าง");
    }
  }
  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title="ลูกค้า" editingId={editingId} />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>ลูกค้า</CardTitle>
              {/* <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription> */}
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

              {!editingId && (
                <PasswordInput
                  register={register}
                  errors={errors}
                  label="รหัสผ่าน"
                  name="password"
                  icon={Lock}
                  placeholder="กรอกรหัสผ่าน"
                  type="password"
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="รูปภาพโปรไฟล์ ลูกค้า"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="clientProfileImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/clients"
        editingId={editingId}
        loading={loading}
        title="ลูกค้า"
        parent=""
      />
    </form>
  );
}
