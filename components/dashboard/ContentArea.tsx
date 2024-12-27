import {
  Grid,
  List,
  File as FileIcon,
  Folder as FolderIcon,
  FileText,
  FileSpreadsheet,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { File } from "@prisma/client";
import moment from "moment";
import "moment/locale/th";
moment.locale("th");

import emptyFolder from "@/public/images/empty-folder.png";
import Image from "next/image";
import { FolderWithRelations } from "./FileManagerPage";
import FolderForm from "../Forms/FolderForm";
import { Progress } from "../ui/progress";
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
import { formatFileSize } from "@/lib/formatFileSize";
interface ContentAreaProps {
  totalSpace: number;
  usedSpace: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onSelectFile: (file: File) => void;
  onFolderClick: (folderId: string) => void;
  currentFolderId: string | null;
  folders: FolderWithRelations[];
  files: File[];
}

export function ContentArea({
  usedSpace,
  totalSpace,
  viewMode,
  onViewModeChange,
  onSelectFile,
  onFolderClick,
  currentFolderId,
  folders,
  files,
}: ContentAreaProps) {
  const percentage = Number((usedSpace / totalSpace) * 100).toFixed(2);

  const getColor = (percent: number) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-orange-500";
    if (percent >= 50) return "bg-yellow-500";
    if (percent >= 30) return "bg-green-500";
    return "bg-zinc-200";
  };

  const getFileIcon = (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return (
          <FaFilePdf className="w-6 h-6 flex-shrink-0 mr-2 text-red-500" />
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaImage className="w-6 h-6 flex-shrink-0 mr-2 text-gray-600" />;
      case "doc":
      case "docx":
        return (
          <FaFileWord className="w-6 h-6 flex-shrink-0 mr-2 text-blue-500" />
        );
      case "xls":
      case "xlsx":
        return (
          <FaFileExcel className="w-6 h-6 flex-shrink-0 mr-2 text-green-500" />
        );
      case "ppt":
      case "pptx":
        return (
          <FaFilePowerpoint className="w-6 h-6 flex-shrink-0 mr-2 text-orange-500" />
        );
      case "zip":
      case "gzip":
      case "tar":
        return (
          <FaFileArchive className="w-6 h-6 flex-shrink-0 mr-2 text-yellow-600" />
        );
      case "txt":
        return (
          <MdTextSnippet className="w-6 h-6 flex-shrink-0 mr-2 text-gray-500" />
        );
      default:
        return (
          <FaFileAlt className="w-6 h-6 flex-shrink-0 mr-2 text-gray-500" />
        ); // Default icon for other file types
    }
  };
  const rootFolder = ["Root", "Projects", "Documents"];

  return (
    <div className="py-2 px-4">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-4 ">
        {/* progress */}
        <div className=" w-52 sm:w-96 flex flex-col sm:flex-row items-start sm:items-center gap-x-4 gap-y-1 pr-4 sm:pr-0 ">
          <div
            className={`flex-auto w-full sm:w-auto  relative ${getColor(
              parseFloat(percentage)
            )} h-2.5 rounded-full overflow-hidden`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 `}
              style={{ width: `${percentage}%` }}
            />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium text-zinc-600 bg-white/80 px-1 rounded ">
              {percentage}%
            </span>
          </div>
          <div className=" flex text-xs font-bold text-muted-foreground">
            {formatFileSize(usedSpace)} / {formatFileSize(totalSpace)}
          </div>
        </div>
        {/* end progress */}

        <div className="flex space-x-1">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid className="h-4 w-4 " />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4 " />
          </Button>
        </div>
      </div>

      {/* Content Grid/List */}
      <div
        className={`grid gap-2 sm:gap-4 ${
          viewMode === "grid" ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {/* Render Folders */}
        {folders.map((folder) => (
          <Card
            key={folder.id}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={() => onFolderClick(folder.id)}
          >
            <CardContent className="flex items-center p-2 sm:p-4 justify-between">
              <div className="flex items-center w-full ">
                <FolderIcon className="h-4 w-4 sm:h-8 sm:w-8 " />
                <div className="flex-1 w-16 ml-2">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {folder.name}
                  </h3>
                  {viewMode === "list" && (
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      <span>{`${
                        (folder.subFolders && folder.subFolders.length) ?? 0
                      } folders, ${
                        (folder.files && folder.files.length) ?? 0
                      } files`}</span>
                      <span className="ml-2">•</span>
                      <span className="ml-2">
                        {/* time th */}
                        {moment(folder.createdAt).format("L")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {!rootFolder.includes(folder.name) && (
                <div className="" onClick={(e) => e.stopPropagation()}>
                  <FolderForm
                    currentFolderId={currentFolderId}
                    userId={folder.userId}
                    initialName={folder.name}
                    editingId={folder.id}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Render Files */}
        {files.map((file) => (
          <Card
            key={file.id}
            className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            onClick={() => onSelectFile(file)}
          >
            <CardContent className="flex items-center p-2 sm:p-4">
              {getFileIcon(file)}
              <div className="flex-1 ml-2 line-clamp-1">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {file.name}
                </h3>
                {viewMode === "list" && (
                  <div className="text-sm text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="ml-2">•</span>
                    <span className="ml-2">
                      {" "}
                      {moment(file.createdAt).format("L")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {folders.length === 0 && files.length === 0 && (
          <div className="col-span-full w-full flex flex-col justify-center items-center min-h-[calc(100vh-16rem)] ">
            <div className=" flex flex-col justify-center items-center">
              <Image
                src={emptyFolder}
                alt="empty"
                height={224}
                width={224}
                className="h-24 w-24  object-cover "
              />
              <p className="text-lg text-muted-foreground mt-4 mb-6">
                โฟลเดอร์ว่างเปล่า
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
