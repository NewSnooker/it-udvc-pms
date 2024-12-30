import { UploadDropzone } from "@/lib/uploadthing";
import React from "react";
import toast from "react-hot-toast";
import { FileProps, MultipleImageInputProps } from "./MultipleFileUpload";

type MultipleImageInputPropsEmailCompose = MultipleImageInputProps & {
  setOpen?: any;
};

export default function MultipleImageInputPropsEmailCompose({
  label,
  files,
  setFiles,
  className = "col-span-full",
  endpoint = "",
  setOpen,
}: MultipleImageInputPropsEmailCompose) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center ">
        <label
          htmlFor="course-image"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-50"
        >
          {label}
        </label>
      </div>
      <UploadDropzone
        className="ut-allowed-content:hidden"
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          console.log(res);
          const newFiles = res.map((item) => ({
            key: item.key,
            url: item.url,
            title: item.name,
            size: item.size,
            type: item.type,
          }));
          setFiles((prevFiles: FileProps[]) => [...prevFiles, ...newFiles]); // เพิ่มไฟล์ใหม่เข้าไปในลิสต์
          setOpen(false);
          console.log("Upload Completed");
        }}
        onUploadError={(error) => {
          toast.error(`อัพโหลดไฟล์ไม่สําเร็จ! \n${error.message}`);
          console.log(`ERROR! ${error.message}`, error);
        }}
      />
    </div>
  );
}
