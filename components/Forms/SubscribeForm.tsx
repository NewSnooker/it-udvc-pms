"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";
import { BellIcon, Mail } from "lucide-react";
import { createSubscription } from "@/actions/subscribe";

export type SelectOptionProps = {
  label: string;
  value: string;
};

export type SubscribeFormProps = {
  id?: string;
  createdAt?: Date;
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
    // กำหนด userId ให้กับ data (ถ้าไม่มีจะเป็นค่าว่าง)
    data.userId = userId ?? "";

    try {
      // เริ่มแสดง loading state
      setLoading(true);

      // เรียกใช้ API สร้าง subscription
      const res = await createSubscription(data);

      // ตรวจสอบผลลัพธ์
      if (res?.status === 201) {
        // สำเร็จ
        setLoading(false);
        toast.success("Subscribe สําเร็จ!");
        reset();
      } else if (res?.status === 400) {
        setLoading(false);
        toast.error(res.error ?? "Unknown error");
      } else if (res?.status === 409) {
        setLoading(false);
        toast.error(res.error ?? "Unknown error");
      } else {
        console.log(res);
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
