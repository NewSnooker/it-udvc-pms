"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { generateSlug } from "@/lib/generateSlug";
import toast from "react-hot-toast";
import { ProjectProps } from "@/types/types";
import FormHeader from "./FormHeader";
import TextInput from "../FormInputs/TextInput";
import TextArea from "../FormInputs/TextAreaInput";
import ImageInput from "../FormInputs/ImageInput";
import FormFooter from "./FormFooter";
import { Project, User } from "@prisma/client";
import FormSelectInput from "../FormInputs/FormSelectInput";
import { createProject, updateProjectById } from "@/actions/projects";
import { convertDateToIso } from "@/lib/convertDateToIso";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type ProjectFormProps = {
  editingId?: string | undefined;
  initialData?: Project | undefined | null;
  userId?: string;
  clients?: SelectOptionProps[];
};
export default function ProjectForm({
  editingId,
  initialData,
  userId,
  clients,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      name: initialData?.name,
      description: initialData?.description || "",
      startDate: initialData?.startDate || null,
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.thumbnail || "/thumbnail.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const initialClientId = initialData?.clientId || "";
  const initialClient = clients?.find((user) => user.value === initialClientId);
  const [selectedClient, setSelectedClient] = useState<any>(initialClient);

  async function saveProject(data: ProjectProps) {
    try {
      setLoading(true);
      data.slug = generateSlug(data.name);
      data.thumbnail = imageUrl;
      data.userId = userId;
      data.clientId = selectedClient?.value || "";
      data.startDate = convertDateToIso(data.startDate);

      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("อัพเดตโครงการสําเร็จ!");
        //reset
        reset();
        //route
        router.push("/dashboard/projects");
        setImageUrl("/placeholder.svg");
      } else {
        await createProject(data);
        setLoading(false);
        // Toast
        toast.success("สร้างโครงการสําเร็จ!");
        //reset
        reset();
        setImageUrl("/thumbnail.png");
        //route
        router.push("/dashboard/projects");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(saveProject)}>
      <FormHeader title="โครงการ" editingId={editingId} />

      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>โครงการ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="ชื่อโครงการ"
                    name="name"
                    placeholder="กรอกชื่อโครงการ"
                  />
                </div>
                <div className="grid gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="วันที่เริ่ม"
                    name="startDate"
                    type="date"
                    placeholder="กรอกวันที่เริ่ม"
                  />
                </div>
                <div className="grid gap-3">
                  <FormSelectInput
                    label="ลูกค้าโครงการ"
                    options={clients || []}
                    option={selectedClient}
                    setOption={setSelectedClient}
                    toolTipText="เพิ่มลูกค้าในโครงการ"
                    href="/dashboard/clients/new"
                  />
                </div>
                <div className="grid gap-3">
                  <TextArea
                    register={register}
                    errors={errors}
                    label="รายละเอียดโครงการ"
                    name="description"
                    placeholder="กรอกรายละเอียดโครงการ"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <ImageInput
              title="รูปภาพ โครงการ"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="projectThumbnail"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/projects"
        editingId={editingId}
        loading={loading}
        title="โครงการ"
        parent=""
      />
    </form>
  );
}
