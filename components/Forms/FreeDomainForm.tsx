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

type FreeDomainFormProps = {
  editingId?: string | undefined;
  initialFreeDomain?: string | undefined | null;
  setIsEditingFdm: (value: boolean) => void;
};

export default function FreeDomainForm({
  editingId,
  initialFreeDomain,
  setIsEditingFdm,
}: FreeDomainFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      freeDomain: initialFreeDomain || "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function updateFreeDomain(data: ProjectProps) {
    try {
      setLoading(true);
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        setIsEditingFdm(false);
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
      onSubmit={handleSubmit(updateFreeDomain)}
    >
      <div className="flex-grow min-w-0">
        <TextInput
          register={register}
          errors={errors}
          name="freeDomain"
          icon={LinkIcon}
          placeholder="https://example.vercel.app"
          // className="w-full"
        />
      </div>

      <SubmitButton
        buttonIcon={Check}
        size="icon"
        loading={loading}
        loadingTitle=""
        className="flex-shrink-0"
      />
    </form>
  );
}
