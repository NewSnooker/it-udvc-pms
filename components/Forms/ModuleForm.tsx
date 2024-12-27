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
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Package, SquarePen, Trash } from "lucide-react";
import SubmitButton from "../FormInputs/SubmitButton";
import { createModule, deleteModule, updateModuleById } from "@/actions/module";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        reset();
        toast.success("อัพเดตฟังก์ชั่นโครงการสําเร็จ!");
        setOpen(false);
      } else {
        await createModule(data);
        setLoading(false);
        reset();
        toast.success("เพิ่มฟังก์ชั่นโครงการสําเร็จ!");
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  async function handleModuleDelete(id: string) {
    setLoading(true);
    try {
      const res = await deleteModule(id);
      if (res && res.ok) {
        setLoading(false);
        toast.success("ลบฟังก์ชั่นโครงการสําเร็จ!");
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("ลบฟังก์ชั่นโครงไม่สำเร็จ!");
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
          <Button size="sm" className="w-full sm:w-auto">
            <Package className="w-4 h-4 mr-1.5" />
            เพิ่มฟังก์ชั่นโครงการ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {editingId
              ? `แก้ไขฟังก์ชั่น: ${initialModule}`
              : "เพิ่มฟังก์ชั่นโครงการ"}
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

          <div
            className={`w-full mt-4 ${
              editingId ? "flex  justify-between gap-4" : ""
            } `}
          >
            {editingId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    className="w-full "
                  >
                    <Trash className="h-4 w-4  mr-1.5 " />
                    ลบ<p className="hidden sm:inline">ฟังก์ชั่นโครงการ</p>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="py-10">
                  <AlertDialogHeader>
                    <AlertDialogTitle>คุณแน่ใจแล้วหรือไม่?</AlertDialogTitle>
                    <AlertDialogDescription>
                      เมื่อดำเนินการนี้ไม่สามารถยกเลิกได้
                      การดำเนินการนี้จะลบสิ่งนี้อย่างถาวร
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction className="px-0">
                      <Button
                        variant={"destructive"}
                        className="w-full sm:w-auto"
                        onClick={() => handleModuleDelete(editingId)}
                      >
                        ยืนยันการลบ
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <SubmitButton
              title={
                editingId ? "แก้ไขฟังก์ชั่นโครงการ" : "เพิ่มฟังก์ชั่นโครงการ"
              }
              loading={loading}
              className="w-full"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
