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
import { CalendarClock, Coins, UserIcon } from "lucide-react";
import { convertIsoDateToNormal } from "@/lib/convertIsoDateToNormal";
import FormDate from "../FormInputs/FormDate";

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
      budget: initialData?.budget || 0,
      startDate: editingId
        ? convertIsoDateToNormal(initialData?.startDate ?? "") || null
        : "",
      endDate: editingId
        ? convertIsoDateToNormal(initialData?.endDate ?? "") || null
        : "",
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.thumbnail || "/thumbnail.png";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const initialClientId = initialData?.clientId || "";
  const initialClient = clients?.find((user) => user.value === initialClientId);
  const [selectedClient, setSelectedClient] = useState<any>(initialClient);
  const [formData, setFormData] = useState({
    startDate: initialData?.startDate || undefined,
    endDate: initialData?.endDate || undefined,
  });
  const [dateErrors, setDateErrors] = useState({
    startDate: false,
    endDate: false,
  });

  // formData convert to ISO #Wed Jan 15 2025 00:00:00 GMT+0700 (Indochina Time)

  const handleDateChange = (name: string, date: string | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
    setDateErrors((prev) => ({ ...prev, [name]: !date }));
  };

  async function saveProject(data: ProjectProps) {
    try {
      setLoading(true);
      const differenceInTime =
        new Date(formData.endDate ?? "").getTime() -
        new Date(formData.startDate ?? "").getTime();
      if (differenceInTime < 0) {
        toast.error(
          "วันที่เริ่มต้นโครงการ\nต้องเป็นวันก่อนที่วันสิ้นสุดโครงการ"
        );
        setLoading(false);
        return;
      }
      const deadline = differenceInTime / (1000 * 60 * 60 * 24);
      data.deadline = deadline;
      data.slug = generateSlug(data.name);
      data.thumbnail = imageUrl;
      data.userId = userId;
      data.clientId = selectedClient?.value || "";
      data.startDate = formData.startDate;
      data.endDate = formData.endDate;
      data.budget = Number(data.budget);
      data.notes = "";
      if (!data.clientId) {
        setLoading(false);
        toast.error("กรุณาเลือกลูกค้าโครงการ");
        return;
      }

      if (!data.startDate || !data.endDate) {
        setDateErrors((prev) => ({
          ...prev,
          startDate: !data.startDate,
          endDate: !data.endDate,
        }));
        setLoading(false);
        return;
      }

      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);

        toast.success("แก้ไขโครงการสําเร็จ!");
        //reset
        reset();
        //route
        router.push("/dashboard/projects");
        setImageUrl("/placeholder.svg");
      } else {
        const res = await createProject(data);
        if (res?.status === 404) {
          setLoading(false);
          toast.error(res?.error);
          return;
        } else if (res?.status === 409) {
          setLoading(false);
          toast.error(res?.error);
          return;
        } else if (res?.status === 200) {
          setLoading(false);
          toast.success("เพิ่มโครงการสําเร็จ!");
          reset();
          setImageUrl("/thumbnail.png");
          router.push("/dashboard/projects");
        } else {
          toast.error("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
        }
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
                <div className="grid grid-cols-12 gap-4 w-full">
                  <div className="col-span-full lg:col-span-8">
                    <TextInput
                      register={register}
                      errors={errors}
                      label="ชื่อโครงการ"
                      name="name"
                      placeholder="กรอกชื่อโครงการ"
                    />
                  </div>
                  <div className="col-span-full lg:col-span-4">
                    <TextInput
                      register={register}
                      errors={errors}
                      label="งบประมาณ "
                      name="budget"
                      type="number"
                      unit="บาท"
                      icon={Coins}
                      placeholder="กรอกงบประมาณ"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <FormDate
                    label="วันที่เริ่มต้น"
                    name="startDate"
                    initialDate={formData.startDate}
                    error={dateErrors.startDate}
                    onDateChange={handleDateChange}
                  />
                  <FormDate
                    label="วันที่สิ้นสุด"
                    name="endDate"
                    initialDate={formData.endDate}
                    error={dateErrors.endDate}
                    onDateChange={handleDateChange}
                    className="w-full"
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
