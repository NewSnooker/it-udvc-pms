"use client";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Check,
  CloudUpload,
  Delete,
  File,
  ListFilter,
  Loader2,
  Mail,
  PlusCircle,
  Search,
  Send,
  SendHorizonal,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import { SiMicrosoftexcel } from "react-icons/si";
import {
  Options,
  SelectValue,
} from "react-tailwindcss-select/dist/components/type";
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
import { formatBytes } from "@/lib/formatBytes";
import exportDataToExcel from "@/lib/exportDataToExcel";
import DialogInviteClient from "./DialogInviteClient";

type TableHeaderProps = {
  title: string;
  href: string;
  linkTitle: string;
  data: any;
  model: string;
  showImport?: boolean;
  userId?: string | null | undefined;
};
export default function TableHeader({
  title,
  href,
  linkTitle,
  data,
  model,
  showImport = true,
  userId,
}: TableHeaderProps) {
  const [status, setStatus] = useState<SelectValue>(null);
  const [date, setDate] = useState<SelectValue>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  let excelDownload = "#";
  if (model === "category") {
    excelDownload = "/Categories.xlsx";
  } else if (model === "brand") {
    excelDownload = "/Brands.xlsx";
  } else if (model === "warehouse") {
    excelDownload = "/Warehouses.xlsx";
  } else if (model === "supplier") {
    excelDownload = "/Suppliers.xlsx";
  } else if (model === "unit") {
    excelDownload = "/Units.xlsx";
  } else if (model === "product") {
    excelDownload = "/Products.xlsx";
  }
  console.log(excelFile);
  const options: Options = [
    { value: "true", label: "Active" },
    { value: "false", label: "Disabled" },
  ];
  const dateOptions: Options = [
    { value: "lastMonth", label: "Last Month" },
    { value: "thisMonth", label: "This Month" },
  ];
  const handleStatusChange = (item: SelectValue) => {
    console.log("value:", item);
    setStatus(item);
  };
  const handleDateChange = (item: SelectValue) => {
    console.log("value:", item);
    setDate(item);
  };

  function previewData() {
    setPreview(true);
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          // SheetName
          const sheetName = workbook.SheetNames[0];
          // Worksheet
          const workSheet = workbook.Sheets[sheetName];
          // Json
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));
        }
      };
      reader.readAsBinaryString(excelFile);
    }
  }
  function saveData() {
    setPreview(false);
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          // SheetName
          const sheetName = workbook.SheetNames[0];
          // Worksheet
          const workSheet = workbook.Sheets[sheetName];
          // Json
          const json = XLSX.utils.sheet_to_json(workSheet);
          setJsonData(JSON.stringify(json, null, 2));

          // try {
          //   setLoading(true);
          //   if (model === "category") {
          //     const categories = json.map((item: any) => {
          //       return {
          //         title: item.Title,
          //         slug: generateSlug(item.Title),
          //         description: item.Description,
          //         imageUrl: item.Image,
          //         mainCategoryId: item.mainCategoryId,
          //         status: true,
          //       };
          //     });
          //     await createBulkCategories(categories);
          //   }
          //   setLoading(false);
          //   setUploadSuccess(true);
          //   window.location.reload();
          //   toast.success("All Data Synced Successfully with No errors 👍");
          // } catch (error) {
          //   setUploadSuccess(false);
          //   setLoading(false);
          //   toast.error("Something went wrong, Please Try again 😢");
          //   console.log(error);
          // }

          //   หลังบ้านต้องมีสิ่งนี้ เพื่อที่จะอัพโหลดไฟล์
          // }
          // export async function createBulkCategories(categories: CategoryProps[]) {
          //   try {
          //     for (const category of categories) {
          //       await createCategory(category);
          //     }
          //   } catch (error) {
          //     console.log(error);
          //   }
          // }
        }
      };
      reader.readAsBinaryString(excelFile);
    }
  }
  function handleExportData() {
    console.log("data exported");
    const today = new Date();
    const filename = `Exported ${title} ${today.toDateString()}`;
    // console.log(filename);
    exportDataToExcel(data, filename);
  }
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-600 py-3">
        <h2 className="scroll-m-20 text-center sm:text-left text-2xl font-semibold tracking-tight">
          {title}({data.length})
        </h2>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:ml-auto">
          <Button
            onClick={handleExportData}
            size="sm"
            variant="outline"
            className="h-8"
          >
            <SiMicrosoftexcel className="h-3.5 w-3.5 sm:mr-1" />
            <span className="hidden sm:inline whitespace-nowrap">Export</span>
          </Button>

          {showImport && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setUploadSuccess(false)}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <RiFileExcel2Line className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline whitespace-nowrap">
                    Import
                  </span>
                </Button>
              </DialogTrigger>
              {loading ? (
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Excel Upload</DialogTitle>
                    <DialogDescription className="text-xs">
                      You can Bring all your Data from excel, Please Download
                      the Sample file First to Make Sure you have Data Columns
                      Named Correctly
                    </DialogDescription>
                  </DialogHeader>
                  <div className="h-60 w-full rounded-md border flex items-center justify-center">
                    <Button disabled className="items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing Data Please wait ...
                    </Button>
                  </div>
                  {!loading && (
                    <DialogFooter className="justify-between ">
                      {preview ? (
                        <Button
                          onClick={() => setPreview(false)}
                          variant={"outline"}
                          type="button"
                        >
                          Stop Preview
                        </Button>
                      ) : (
                        <Button
                          onClick={previewData}
                          variant={"outline"}
                          type="button"
                        >
                          Preview
                        </Button>
                      )}
                      <Button onClick={saveData} type="button">
                        Save Data
                      </Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              ) : (
                <>
                  {uploadSuccess ? (
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Excel Upload</DialogTitle>
                        <DialogDescription className="text-xs">
                          You can Bring all your Data from excel, Please
                          Download the Sample file First to Make Sure you have
                          Data Columns Required
                        </DialogDescription>
                      </DialogHeader>
                      <div className="h-72 w-full rounded-md border flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                          <Check className="h-20 w-16 text-green-500 " />
                        </div>
                        <h2 className="text-xs pt-2 px-8 text-center">
                          Data Synced Successfully. You can close the Window
                        </h2>
                      </div>

                      <DialogFooter className="justify-between ">
                        <DialogClose asChild>
                          <Button
                            onClick={() => window.location.reload()}
                            type="button"
                            variant="secondary"
                          >
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  ) : (
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Excel Upload</DialogTitle>
                        <DialogDescription className="text-xs">
                          You can Bring all your Data from excel, Please
                          Download the Sample file First to Make Sure you have
                          Data Columns Required
                        </DialogDescription>
                      </DialogHeader>
                      {preview && jsonData ? (
                        <ScrollArea className="h-72 w-full rounded-md border">
                          <div className="p-4">
                            <pre>{jsonData}</pre>
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="grid gap-4 py-4">
                          <Button asChild variant="outline">
                            <Link href={excelDownload} download>
                              Download {model} Sample Data
                            </Link>
                          </Button>

                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex lg:flex-col flex-row  items-center justify-center w-full h-16 lg:h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:hover:bg-bray-800 dark:bg-zinc-800 hover:bg-zinc-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-zinc-800"
                            >
                              <div className="flex flex-row lg:flex-col items-center justify-center pt-5 pb-6 gap-4 lg:gap-0">
                                <CloudUpload className="w-8 h-8 mb-4 text-zinc-500 dark:text-zinc-400" />

                                <p className="lg:mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  <span className="hidden lg:inline">
                                    {" "}
                                    or drag and drop
                                  </span>
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                  Only Excel Files (.xlsx)
                                </p>
                              </div>
                              <input
                                id="dropzone-file"
                                accept=".xls,.xlsx"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  setExcelFile(
                                    e.target.files ? e.target.files[0] : null
                                  )
                                }
                              />
                            </label>
                          </div>
                          {excelFile && (
                            <div className="flex items-center shadow-lg rounded-md lg:py-3 py-2 px-6 bg-zinc-100 dark:bg-zinc-900 justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 lg:w-14 lg:h-14 p-2 lg:p-4 bg-zinc-300 dark:bg-zinc-500 rounded flex items-center justify-center flex-shrink-0">
                                  <RiFileExcel2Line className="h-4 w-4" />
                                </div>
                                <div className="">
                                  <p className="text-sm font-semibold">
                                    {excelFile.name}
                                  </p>
                                  <span className="text-xs">
                                    {formatBytes(excelFile.size)}
                                  </span>
                                </div>
                              </div>
                              <button onClick={() => setExcelFile(null)}>
                                <X className="text-zinc-600 w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <DialogFooter className="justify-between ">
                        {preview ? (
                          <Button
                            onClick={() => setPreview(false)}
                            variant={"outline"}
                            type="button"
                          >
                            Stop Preview
                          </Button>
                        ) : (
                          <Button
                            onClick={previewData}
                            variant={"outline"}
                            type="button"
                          >
                            Preview
                          </Button>
                        )}
                        <Button onClick={saveData} type="button">
                          Save Data
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </>
              )}
            </Dialog>
          )}

          {model === "clients" && <DialogInviteClient userId={userId ?? ""} />}

          <Button size="sm" asChild className="h-8">
            <Link href={href}>
              <PlusCircle className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline whitespace-nowrap">
                {linkTitle}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
