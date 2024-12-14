"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ProjectProps } from "@/types/types";
import { updateProjectById } from "@/actions/projects";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import { Check, LinkIcon } from "lucide-react";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type CustomDomainFormProps = {
  editingId?: string | undefined;
  initialCustomDomain?: string | undefined | null;
  setIsEditingCdm: (value: boolean) => void;
};
export default function CustomDomainForm({
  editingId,
  initialCustomDomain,
  setIsEditingCdm,
}: CustomDomainFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      customDomain: initialCustomDomain || "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function updateCustomDomain(data: ProjectProps) {
    try {
      setLoading(true);
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        setIsEditingCdm(false);
        toast.success("อัพเดตโดเมนสําเร็จ!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form
      className="flex items-between gap-2 w-full"
      onSubmit={handleSubmit(updateCustomDomain)}
    >
      <div className=" flex-grow min-w-0">
        <TextInput
          register={register}
          errors={errors}
          name="customDomain"
          icon={LinkIcon}
          placeholder="https://example.com"
          // className="w-full"
        />
      </div>

      <SubmitButton
        buttonIcon={Check}
        size={"icon"}
        loading={loading}
        loadingTitle=""
        className="flex-shrink-0"
      />
    </form>
  );
}
