"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CommentProps } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { MessageSquareText, Pen, Send } from "lucide-react";
import SubmitButton from "../FormInputs/SubmitButton";
import dynamic from "next/dynamic";
import { UserRole } from "@prisma/client";
import { createComment, updateCommentById } from "@/actions/comments";
const QuillEditor = dynamic(
  () => import("@/components/FormInputs/QuillEditor"),
  {
    ssr: false,
  }
);

export default function CommentForm({
  projectId,
  userId,
  userName,
  userRole,
  initialContent,
  editingId,
}: {
  projectId: string;
  userId: string;
  userRole: string;
  userName: string;
  initialContent?: string;
  editingId?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentProps>({
    // defaultValues: {
    // },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  async function saveComment(data: CommentProps) {
    setLoading(true);
    if (!content || content.trim() === "" || content.trim() === "<p><br></p>") {
      setLoading(false);
      toast.error("กรุณากรอกเนื้อหา");
      return;
    }
    data.content = content ?? "";
    data.userName = userName;
    data.projectId = projectId;
    data.userRole = userRole;
    data.userId = userId;

    try {
      if (editingId) {
        await updateCommentById(editingId, data);
        setLoading(false);
        toast.success("อัปเดตความคิดเห็นสําเร็จ!");
        reset();
      } else {
        await createComment(data);
        setLoading(false);
        toast.success("แสดงความคิดเห็นสําเร็จ!");
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
            <Pen className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" className="w-full  ">
            <MessageSquareText className="w-5 h-5" />
            {/* ความคิดเห็น */}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingId ? "แก้ไขความคิดเห็น" : "แสดงความคิดเห็น"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(saveComment)}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <QuillEditor
                label={
                  editingId
                    ? "แก้ไขความคิดเห็นสําหรับโครงการนี้"
                    : "แสดงความคิดเห็นและตอบกลับสําหรับโครงการนี้"
                }
                className=""
                value={content}
                onChange={setContent}
              />
              <SubmitButton
                title={editingId ? "แก้ไข" : "ส่ง"}
                loading={loading}
                className="mt-2"
                buttonIcon={Send}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
