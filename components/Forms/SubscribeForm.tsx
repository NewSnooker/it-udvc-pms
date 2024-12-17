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
      const res = await createSubscription(data);
      if (res?.status === 201) {
        setLoading(false);
        toast.success("Subscribe สําเร็จ!");
        reset();
      } else if (res?.status === 409) {
        setLoading(false);
        toast.error(res.error);
      } else {
        setLoading(false);
        toast.error("เกิดข้อผิดพลาดในการ Subscribe!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form
      className="flex items-between items-end gap-2 w-full"
      onSubmit={handleSubmit(updateSubscribe)}
    >
      <div className="flex-grow min-w-0">
        <TextInput
          label="ติดตามข่าวสารของฉัน"
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
