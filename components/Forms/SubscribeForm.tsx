"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateProjectById } from "@/actions/projects";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import { BellIcon, Check, LinkIcon, Mail } from "lucide-react";
import { createSubscription } from "@/actions/subscribe";

export type SelectOptionProps = {
  label: string;
  value: string;
};

export type SubscribeFormProps = {
  email: string;
  userId: string;
};

export default function SubscribeForm({ userId }: { userId: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscribeFormProps>({
    defaultValues: {},
  });

  const [loading, setLoading] = useState(false);

  async function updateSubscribe(data: SubscribeFormProps) {
    data.userId = userId ?? "";
    try {
      setLoading(true);
      await createSubscription(data);
      setLoading(false);
      toast.success("Subscribe สําเร็จ!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("เกิดข้อผิดพลาดในการ Subscribe!");
    }
  }

  return (
    <form
      className="flex items-between gap-2 w-full"
      onSubmit={handleSubmit(updateSubscribe)}
    >
      <div className="flex-grow min-w-0">
        <TextInput
          type="email"
          register={register}
          errors={errors}
          name="email"
          icon={Mail}
          placeholder="กรอกอีเมลของคุณ"
        />
      </div>

      <SubmitButton
        title="Subscribe"
        buttonIcon={BellIcon}
        size="icon"
        loading={loading}
        loadingTitle="Subscribing..."
        className="flex-shrink-0"
      />
    </form>
  );
}
