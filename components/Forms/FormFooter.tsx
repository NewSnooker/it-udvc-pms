import React from "react";
import CloseButton from "../FormInputs/CloseButton";
import SubmitButton from "../FormInputs/SubmitButton";
import { Pencil, PlusCircle } from "lucide-react";

export default function FormFooter({
  href,
  editingId,
  loading,
  title,
  parent,
}: {
  href: string;
  editingId?: string | undefined;
  loading: boolean;
  title: string;
  parent?: string;
}) {
  return (
    <div className="flex items-center  gap-2 justify-between ">
      <CloseButton href={href} parent={parent} />
      <SubmitButton
        title={editingId ? `แก้ไข${title}` : `เพิ่ม${title}`}
        loading={loading}
        buttonIcon={editingId ? Pencil : PlusCircle}
      />
    </div>
  );
}
