"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { FolderProps } from "@/types/types";
import SubmitButton from "../FormInputs/SubmitButton";
import {
  EllipsisVertical,
  Folder,
  FolderPlus,
  Pencil,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import TextInput from "../FormInputs/TextInput";
import {
  createFolder,
  deleteFolderCascadeTransaction,
  updateFolderById,
} from "@/actions/fileManager";
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
} from "../ui/alert-dialog";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type FolderFormProps = {
  currentFolderId: string | null;
  userId: string;
  editingId?: string | undefined | null;
  initialName?: string | undefined | null;
};

export default function FolderForm({
  currentFolderId,
  userId,
  editingId,
  initialName,
}: FolderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FolderProps>({
    defaultValues: {
      name: initialName || "",
      userId: userId,
    },
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function saveFolderManager(data: FolderProps) {
    if (
      data.name === "Root" ||
      data.name === "Documents" ||
      data.name === "Projects"
    ) {
      toast.error("ชื่อโฟลเดอร์นี้ไม่สามารถใช้ได้!");
      return;
    }
    data.name = data.name.trim();
    data.userId = userId;
    data.parentFolderId = currentFolderId || "";
    try {
      setLoading(true);
      if (editingId) {
        await updateFolderById(editingId, data);
        reset();
        setLoading(false);
        setOpen(false);

        toast.success("อัพเดตโฟลเดอร์สําเร็จ!");
      } else {
        const res = await createFolder(data);
        if (res.ok) {
          reset();
          setLoading(false);
          setOpen(false);
          toast.success("สร้างโฟลเดอร์สําเร็จ!");
        }
        if (res.ok === false) {
          setLoading(false);
          toast.error(`สร้างโฟลเดอร์ไม่สําเร็จ!\n${res.error}`);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function handleFolderDelete(id: string) {
    try {
      const res = await deleteFolderCascadeTransaction(id);
      if (res.ok) {
        toast.success("ลบโฟลเดอร์สําเร็จ!");
        setOpen(false);
      }
      if (res.ok === false) {
        toast.error("ลบโฟลเดอร์ไม่สําเร็จ!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editingId ? (
          <Button
            variant="ghost"
            size="icon"
            className=" transition-all  sm:p-2 sm:h-9 sm:w-9 "
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" className="w-full sm:w-auto">
            <FolderPlus className="w-4 h-4 " />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>
            {editingId ? `แก้ไขโฟลเดอร์: ${initialName}` : "เพิ่มโฟลเดอร์"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(saveFolderManager)}>
          <div className="grid gap-3">
            <TextInput
              register={register}
              errors={errors}
              label=""
              placeholder="กรอกชื่อโฟลเดอร์"
              name="name"
              icon={Folder}
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
                    ลบ<p className="hidden sm:inline">โฟลเดอร์</p>
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
                        onClick={() => handleFolderDelete(editingId)}
                      >
                        ยืนยันการลบ
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <SubmitButton
              title={editingId ? "แก้ไขโฟลเดอร์" : "เพิ่มโฟลเดอร์"}
              loading={loading}
              className="w-full"
              buttonIcon={editingId ? Pencil : PlusCircle}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
