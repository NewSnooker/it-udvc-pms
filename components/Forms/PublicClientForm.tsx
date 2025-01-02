"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserProps } from "@/types/types";
import TextInput from "../FormInputs/TextInput";
import ImageInput from "../FormInputs/ImageInput";
import { createUser } from "@/actions/users";
import PasswordInput from "../FormInputs/PasswordInput";
import {
  Building,
  Check,
  Headset,
  Loader,
  Lock,
  Mail,
  MapPin,
  Pencil,
  User as UserIcon,
} from "lucide-react";
import TextArea from "../FormInputs/TextAreaInput";
import { Button } from "../ui/button";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type PublicClientFormProps = {
  userId?: string;
};
export default function PublicClientForm({ userId }: PublicClientFormProps) {
  const params = useSearchParams();
  const paramEmail = params.get("email");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      email: paramEmail ?? "",
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialImage =
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(initialImage);
  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.name = `${data.firstName} ${data.lastName}`;
    data.image = imageUrl;
    data.role = "CLIENT";
    data.userId = userId;
    try {
      const res = await createUser(data);
      if (res.status === 409) {
        setLoading(false);
        setEmailErr(res.error);
      } else if (res.status === 200) {
        setLoading(false);
        toast.success("ลงทะเบียนลูกค้าสําเร็จ!");
        router.push("/login");
      } else {
        setLoading(false);
        toast.error("เกิดข้อผิดพลาดในการลงทะเบียนลูกค้า!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("เกิดข้อผิดพลาดบางอย่าง!");
    }
  }
  return (
    <form className="max-w-5xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>ลูกค้า</CardTitle>
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

              <PasswordInput
                register={register}
                errors={errors}
                label="รหัสผ่าน"
                name="password"
                icon={Lock}
                placeholder="กรอกรหัสผ่าน"
                type="password"
              />

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
              title="รูปภาพโปรไฟล์ ลูกค้า"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="clientProfileImage"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              กําลังดําเนินการ...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              ยืนยันการลงทะเบียน
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
