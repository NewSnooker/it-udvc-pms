"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { PortfolioProps } from "@/types/types";
import TextInput from "../FormInputs/TextInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import {
  Building,
  Facebook,
  Github,
  Hash,
  Headset,
  Instagram,
  Link,
  Linkedin,
  Mail,
  MapPin,
  Notebook,
  Pencil,
  User as UserIcon,
  X,
  Youtube,
} from "lucide-react";
import TextArea from "../FormInputs/TextAreaInput";
import { createPortfolio, updatePortfolioById } from "@/actions/portfolio";
import { Session } from "next-auth";
import { SiThreads } from "react-icons/si";
import { PortfolioProfile } from "@prisma/client";
import { RiTwitterXFill } from "react-icons/ri";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type PortfolioFormProps = {
  editingId?: string | undefined;
  initialData?: PortfolioProfile | undefined | null;
  session: Session | null;
};
export default function PortfolioForm({
  editingId,
  initialData,
  session,
}: PortfolioFormProps) {
  const user = session?.user;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioProps>({
    defaultValues: {
      name: initialData?.name || user?.name,
      location: initialData?.location || "",
      email: initialData?.email || user?.email,
      description: initialData?.description || "",
      xUrl: initialData?.xUrl || "",
      threadsUrl: initialData?.threadsUrl || "",
      facebookUrl: initialData?.facebookUrl || "",
      youtubeUrl: initialData?.youtubeUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      instagramUrl: initialData?.instagramUrl || "",
      githubUrl: initialData?.githubUrl || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const initialImage =
    initialData?.profileImage ||
    user.image ||
    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  async function onSubmit(data: PortfolioProps) {
    setLoading(true);
    data.profileImage = imageUrl;
    data.userId = user?.id || "";
    try {
      if (editingId) {
        const res = await updatePortfolioById(editingId, data);
        setLoading(false);
        toast.success("อัปเดตPortfolioสําเร็จ!");
        reset();
      } else {
        const res = await createPortfolio(data);
        setLoading(false);
        toast.success("สร้างPortfolioสําเร็จ!");
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
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="ชื่อ"
                  name="name"
                  icon={UserIcon}
                  placeholder="กรอกชื่อ"
                />

                <TextInput
                  type="email"
                  register={register}
                  errors={errors}
                  label="อีเมล"
                  name="email"
                  icon={Mail}
                  placeholder="กรอกอีเมล"
                />

                <div className=" sm:col-span-2">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="ที่อยู่"
                    name="location"
                    icon={MapPin}
                    placeholder="กรอกที่อยู่"
                  />
                </div>

                <TextArea
                  register={register}
                  errors={errors}
                  label="รายละเอียด"
                  name="description"
                  placeholder="กรอกรายละเอียด"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Facebook"
                  name="facebookUrl"
                  icon={Facebook}
                  placeholder="กรอกลิงค์ Facebook"
                  isRequired={false}
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Threads"
                  name="threadsUrl"
                  icon={SiThreads}
                  placeholder="กรอกลิงค์ Threads"
                  isRequired={false}
                />

                <TextInput
                  register={register}
                  errors={errors}
                  label="Instagram"
                  name="instagramUrl"
                  icon={Instagram}
                  placeholder="กรอกลิงค์ Instagram"
                  isRequired={false}
                />

                <TextInput
                  register={register}
                  errors={errors}
                  label="Github"
                  name="githubUrl"
                  icon={Github}
                  placeholder="กรอกลิงค์ Github"
                  isRequired={false}
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Youtube"
                  name="youtubeUrl"
                  icon={Youtube}
                  placeholder="กรอกลิงค์ Youtube"
                  isRequired={false}
                />

                <TextInput
                  register={register}
                  errors={errors}
                  label="X"
                  name="xUrl"
                  icon={RiTwitterXFill}
                  placeholder="กรอกลิงค์ X"
                  isRequired={false}
                />

                <TextInput
                  register={register}
                  errors={errors}
                  label="Linkedin"
                  name="linkedinUrl"
                  icon={Linkedin}
                  placeholder="กรอกลิงค์ Linkedin"
                  isRequired={false}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="รูปโปรไฟล์"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="profileImage"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/"
        editingId={editingId}
        loading={loading}
        title="Portfolio"
        parent=""
      />
    </form>
  );
}
