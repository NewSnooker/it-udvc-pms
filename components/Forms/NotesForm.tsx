"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { ProjectProps } from "@/types/types";
import { updateProjectById } from "@/actions/projects";
import SubmitButton from "../FormInputs/SubmitButton";
import Editor from "../Editor/Editor";

export type SelectOptionProps = {
  label: string;
  value: string;
};
type NotesFormProps = {
  editingId?: string | undefined;
  initialNotes?: string | undefined | null;
  setIsEditingNotes: (value: boolean) => void;
  isEditingNotes: boolean;
};
export default function NotesForm({
  editingId,
  initialNotes,
  setIsEditingNotes,
  isEditingNotes,
}: NotesFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectProps>({
    defaultValues: {
      notes: initialNotes || "",
    },
  });
  const [content, setContent] = useState<any>(initialNotes) || "";
  const [loading, setLoading] = useState(false);

  async function updateNotes(data: ProjectProps) {
    try {
      data.notes = JSON.stringify(content);
      console.log(data);
      setLoading(true);
      if (editingId) {
        await updateProjectById(editingId, data);
        setLoading(false);
        setIsEditingNotes(false);
        toast.success("อัพเดตโน๊ตโครงการสําเร็จ!");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form
      className="prose lg:prose-2xl dark:prose-invert"
      onSubmit={handleSubmit(updateNotes)}
    >
      <div className="grid gap-3">
        <Editor
          initialValue={content}
          isEditable={isEditingNotes}
          onChange={setContent}
        />
        {isEditingNotes && <SubmitButton title="อัพเดต" loading={loading} />}
      </div>
    </form>
  );
}
