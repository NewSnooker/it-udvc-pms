"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TasksProps } from "@/types/types";
import TextInput from "../FormInputs/TextInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  EllipsisVertical,
  Package,
  PlusCircle,
  Trash,
  Plus,
} from "lucide-react";
import SubmitButton from "../FormInputs/SubmitButton";
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
import { TaskStatus } from "@prisma/client";
import { createTask, deleteTask, updateTaskById } from "@/actions/tasks";
import TextArea from "../FormInputs/TextAreaInput";

export default function TaskForm({
  moduleId,
  initialTitle,
  initialDetail,
  initialStatus,
  editingId,
  isDefault,
  titleStatus,
}: {
  moduleId: string;
  initialTitle?: string;
  initialDetail?: string;
  initialStatus: TaskStatus;
  editingId?: string;
  isDefault?: boolean;
  titleStatus?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TasksProps>({
    defaultValues: {
      title: initialTitle || "",
      detail: initialDetail || "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function saveTasks(data: TasksProps) {
    setLoading(true);
    data.moduleId = moduleId;
    data.status = initialStatus;
    try {
      if (editingId) {
        await updateTaskById(editingId, data);
        setLoading(false);
        reset();
        toast.success("อัพเดตงานสําเร็จ!");
        router.refresh();
        setOpen(false);
      } else {
        await createTask(data);
        setLoading(false);
        reset();
        toast.success("เพิ่มงานสําเร็จ!");
        router.refresh();
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
      const res = await deleteTask(id);
      if (res && res.ok) {
        setLoading(false);
        toast.success("ลบงานสําเร็จ!");
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("ลบงานไม่สำเร็จ!");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editingId ? (
          <Button variant="ghost" size="icon" className=" transition-all  ">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            variant={isDefault ? "default" : "ghost"}
            onClick={() => setOpen(true)}
            className={`${isDefault ? "w-full sm:w-auto" : ""}`}
          >
            {isDefault ? (
              <span className=" flex">
                <PlusCircle className="mr-2 h-4 w-4" />
                งานที่ต้องทำ
              </span>
            ) : (
              <Plus className=" h-4 w-4" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {editingId
              ? `แก้ไขงาน: ${initialTitle}`
              : isDefault
              ? "งานที่ต้องทำ"
              : titleStatus}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(saveTasks)}>
          <div className="grid gap-3">
            <TextInput
              register={register}
              errors={errors}
              label="ชื่องาน"
              placeholder="กรอกชื่องาน"
              name="title"
              icon={Package}
            />
            <TextArea
              register={register}
              errors={errors}
              label="รายละเอียด"
              placeholder="กรอกรายละเอียด"
              name="detail"
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
                    ลบ<p className="hidden sm:inline">งาน</p>
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
              title={editingId ? "อัปเดตงาน" : "เพิ่มงาน"}
              loading={loading}
              className="w-full"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
