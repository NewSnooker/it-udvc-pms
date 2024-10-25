"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ModuleProps } from "@/types/types";
import TextInput from "../FormInputs/TextInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Package, SquarePen } from "lucide-react";
import SubmitButton from "../FormInputs/SubmitButton";
import { createModule, updateModuleById } from "@/actions/module";

export default function ModuleForm({
  projectId,
  userId,
  userName,
  initialModule,
  editingId,
}: {
  projectId: string;
  userId: string;
  userName: string;
  initialModule?: string;
  editingId?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleProps>({
    defaultValues: {
      name: initialModule || "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function saveModule(data: ModuleProps) {
    setLoading(true);
    data.userName = userName;
    data.projectId = projectId;
    data.userId = userId;

    try {
      if (editingId) {
        await updateModuleById(editingId, data);
        setLoading(false);
        toast.success("อัพเดตฟังก์ชั่นโครงการสําเร็จ!");
        reset();
      } else {
        await createModule(data);
        setLoading(false);
        toast.success("เพิ่มฟังก์ชั่นโครงการสําเร็จ!");
        reset();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editingId ? (
          <Button variant="ghost" size="icon" className=" transition-all ">
            <SquarePen className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Package className="w-4 h-4 mr-1.5" />
            เพิ่มฟังก์ชั่นโครงการ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingId ? "แก้ไขฟังก์ชั่นโครงการ" : "เพิ่มฟังก์ชั่นโครงการ"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(saveModule)}>
          <div className="grid gap-3">
            <TextInput
              register={register}
              errors={errors}
              label=""
              placeholder="กรอกชื่อฟังก์ชั่นโครงการ"
              name="name"
              icon={Package}
            />
          </div>
          <SubmitButton
            title={
              editingId ? "อัปเดตฟังก์ชั่นโครงการ" : "เพิ่มฟังก์ชั่นโครงการ"
            }
            loading={loading}
            className="mt-4 w-full"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
