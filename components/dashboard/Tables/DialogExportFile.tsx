"use client";
import { useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import exportDataToExcel from "@/lib/exportDataToExcel";
import toast from "react-hot-toast";
import { Download } from "lucide-react";

export default function DialogExportFile({
  title,
  data,
}: {
  title: string;
  data: any;
}) {
  const [open, setOpen] = useState(false);

  // ส่งออกข้อมูล
  function handleExportData(title: string, data: any) {
    console.log("ส่งออกข้อมูลแล้ว");
    const today = new Date();
    const filename = `ส่งออก ${title} ${today.toDateString()}`;

    exportDataToExcel(data, filename);

    // แจ้งเตือนเมื่อดาวน์โหลดเสร็จสิ้น
    toast.success("ดาวน์โหลดไฟล์ Excel สำเร็จ!");

    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="mb-2 text-lg font-bold ">
              ดาวน์โหลด
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              คุณต้องการดาวน์โหลดข้อมูลในรูปแบบไฟล์ Excel หรือไม่?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <div className="flex justify-between w-full">
              <DialogClose asChild>
                <Button type="button" variant="destructive">
                  ปิด
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="default"
                className="flex items-center gap-2"
                onClick={() => handleExportData(title, data)}
              >
                <SiMicrosoftexcel className="h-4 w-4 " />
                ดาวน์โหลด
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
