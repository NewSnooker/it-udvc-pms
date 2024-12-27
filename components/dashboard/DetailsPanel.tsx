import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  FaFileAlt,
  FaFileArchive,
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaImage,
} from "react-icons/fa";
import { MdTextSnippet } from "react-icons/md";
import moment from "moment";
import "moment/locale/th";
import { File } from "@prisma/client";
import { deleteFile } from "@/actions/fileManager";
import { Download, Loader2, Trash } from "lucide-react";
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
import Link from "next/link";
import { formatFileSize } from "@/lib/formatFileSize";
import Image from "next/image";
moment.locale("th");

interface DetailsPanelProps {
  file: File | null;
  onClose: () => void;
  onDelete?: (file: File) => void;
  onDownload?: (file: File) => void;
  onView?: (file: File) => void;
}

const getFileIcon = (file: File) => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  switch (fileExtension) {
    case "pdf":
      return <FaFilePdf className="w-8 h-8 text-red-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaImage className="w-8 h-8 text-blue-400" />;
    case "doc":
    case "docx":
      return <FaFileWord className="w-8 h-8 text-blue-500" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="w-8 h-8 text-green-500" />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint className="w-8 h-8 text-orange-500" />;
    case "zip":
    case "gzip":
    case "tar":
      return <FaFileArchive className="w-8 h-8 text-yellow-600" />;
    case "txt":
      return <MdTextSnippet className="w-8 h-8 text-gray-500" />;
    default:
      return <FaFileAlt className="w-8 h-8 text-gray-500" />;
  }
};

export function DetailsPanel({ file, onClose }: DetailsPanelProps) {
  const [isLoading, setLoading] = useState(false);
  if (!file) return null;

  const handleDelete = async ({ id, key }: { id: string; key: string }) => {
    setLoading(true);
    try {
      await deleteFile(id, key);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sheet open={!!file} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>รายละเอียดไฟล์</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <div className="flex items-center space-x-4 mb-2 ">
            <div className="p-4 bg-gray-50 rounded-lg">{getFileIcon(file)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{file.name}</h3>
              <p className="text-sm text-muted-foreground">{file.type}</p>
            </div>
          </div>
          {(file.type === "image/png" || file.type === "image/jpeg") && (
            <div className=" w-full flex items-center justify-center">
              <Image
                src={file.url}
                alt={file.name}
                width={200}
                height={200}
                loading="lazy"
              />
            </div>
          )}
          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ขนาด</span>
              <span className="font-medium">
                {formatFileSize(Number(file.size) || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">สร้างเมื่อ</span>
              <span className="font-medium">
                {moment(file.createdAt).format("lll")}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-8">
            <div className="flex-1">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isLoading}
                    variant="destructive"
                    size="icon"
                    className="w-full "
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 sm:mr-1.5 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4 sm:mr-1.5 " />
                    )}
                    <p className="hidden sm:inline">ลบโฟลเดอร์</p>
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
                        onClick={() => handleDelete(file)}
                      >
                        ยืนยันการลบ
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Link href={file.url} className="flex-1">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                <span>ดาวน์โหลด</span>
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DetailsPanel;
