"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { UserProps } from "@/types/types";
import TextInput from "../FormInputs/TextInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { updateUserById } from "@/actions/users";
import {
  Building,
  Headset,
  Mail,
  MapPin,
  Pencil,
  User as UserIcon,
} from "lucide-react";
import { User } from "@prisma/client";
import TextArea from "../FormInputs/TextAreaInput";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type BrandFormProps = {
  editingId?: string | undefined;
  initialData?: User | undefined | null;
};
export default function BrandForm({ editingId, initialData }: BrandFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      location: initialData?.location || "",
      companyName: initialData?.companyName || "",
      companyDescription: initialData?.companyDescription || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.userLogo || "/thumbnail.png";
  const initialQrCode = initialData?.qrCodeUrl || "/thumbnail.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQrCode);
  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.userLogo = imageUrl;
    data.qrCodeUrl = qrCodeUrl;
    try {
      if (editingId) {
        const res = await updateUserById(editingId, data);
        if (res?.status === 409) {
          setLoading(false);
          return;
        }
        if (res?.status === 404) {
          setLoading(false);
          return;
        }
        setLoading(false);
        toast.success("อัปเดตบริษัทสําเร็จ!");
        reset();
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("เกิดข้อผิดพลาดบางอย่าง!");
    }
  }
  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าบริษัท</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="ที่อยู่"
                  name="location"
                  icon={MapPin}
                  placeholder="กรอกที่อยู่"
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
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="รูปภาพ โลโก้บริษัท"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="userLogo"
            />
            <ImageInput
              title="คิวอาร์โค้ด"
              imageUrl={qrCodeUrl}
              setImageUrl={setQrCodeUrl}
              endpoint="QrCode"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/"
        editingId={editingId}
        loading={loading}
        title="บริษัท"
        parent=""
      />
    </form>
  );
}
