"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { ProjectProps } from "@/types/types";
import TextArea from "../FormInputs/TextAreaInput";
import { updateProjectById } from "@/actions/projects";
import SubmitButton from "../FormInputs/SubmitButton";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type DescriptionFormProps = {
  editingId?: string | undefined;
  initialDescription?: string | undefined | null;
  setIsEditingDesc: (value: boolean) => void;
};
export default function DescriptionForm({
  editingId,
  initialDescription,
  setIsEditingDesc,
}: DescriptionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      description: initialDescription || "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function updateDescription(data: ProjectProps) {
    try {
      setLoading(true);
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        setIsEditingDesc(false);
        toast.success("อัพเดตรายละเอียดโครงการสําเร็จ!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(updateDescription)}>
      <div className="grid gap-3">
        <TextArea
          register={register}
          errors={errors}
          label=""
          name="description"
        />
        <SubmitButton title="ยืนยันการอัพเดต" loading={loading} />
      </div>
    </form>
  );
}
