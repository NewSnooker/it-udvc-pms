"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { FilePlus2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileProps as createFileProps } from "@/types/types";
import MultipleFileUpload, {
  FileProps,
} from "../FormInputs/MultipleFileUpload";
import { createMultipleFile } from "@/actions/fileManager";
import SubmitButton from "../FormInputs/SubmitButton";

export default function FileUploadForm({ folderId }: { folderId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileProps[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    if (files.length === 0) {
      toast.error("กรุณาเลือกไฟล์");
      setIsLoading(false);
      return;
    }

    const filesMap: createFileProps[] = files.map((file) => {
      return {
        key: file.key,
        name: file.title,
        type: file.type,
        url: file.url,
        size: file.size,
        parentFolderId: folderId,
      };
    });

    try {
      await createMultipleFile(filesMap);
      setFiles([]); // reset files
      setIsLoading(false);
      toast.success("เพิ่มไฟล์สําเร็จ!");
    } catch (error) {
      setIsLoading(false);
      toast.error("เกิดข้อผิดพลาดในการเพิ่มไฟล์!"); // แก้จาก success เป็น error
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full sm:w-auto">
          <FilePlus2 className="w-4 h-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>อัพโหลดไฟล์ของคุณ</DialogTitle>
          </DialogHeader>
          <MultipleFileUpload
            label="เพิ่มไฟล์"
            files={files}
            setFiles={setFiles}
            endpoint="fileUploads"
            className="mb-4"
          />
          <SubmitButton
            title={"เพิ่มไฟล์"}
            loading={isLoading}
            className="w-full"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
