/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { IFolder, TreeView } from "./TreeView";
import { Breadcrumb } from "./Breadcrumb";
import { ContentArea } from "./ContentArea";
import { DetailsPanel } from "./DetailsPanel";
import { Folder, File } from "@prisma/client";
import FolderForm from "../Forms/FolderForm";
import { Input } from "../ui/input";
import FileUploadForm from "../Forms/FileUploadForm";

export interface FolderWithRelations extends Folder {
  subFolders: FolderWithRelations[];
  files: File[];
}

interface FileManagerProps {
  userFolders: FolderWithRelations[];
  userId: string;
  totalBytes: number;
  limitBytes: number;
}

export function FileManagerPage({
  userFolders,
  userId,
  totalBytes,
  limitBytes,
}: FileManagerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    folders: FolderWithRelations[];
    files: File[];
  } | null>(null);

  const getAllFiles = (folders: FolderWithRelations[]): File[] => {
    const allFiles: File[] = [];
    const collectFiles = (folders: FolderWithRelations[]) => {
      for (const folder of folders) {
        allFiles.push(...folder.files); // เพิ่มไฟล์ในโฟลเดอร์ปัจจุบัน
        collectFiles(folder.subFolders); // เรียกซ้ำใน subFolders
      }
    };
    collectFiles(folders);
    return allFiles;
  };

  const findCurrentFolder = (
    folderId: string | null
  ): FolderWithRelations | null => {
    if (!folderId) return null;
    const searchFolder = (
      folders: FolderWithRelations[]
    ): FolderWithRelations | null => {
      for (const folder of folders) {
        if (folder.id === folderId) return folder;
        const found = searchFolder(folder.subFolders);
        if (found) return found;
      }
      return null;
    };
    return searchFolder(userFolders);
  };

  const getCurrentFolderContent = () => {
    const currentFolder = findCurrentFolder(currentFolderId);
    if (!currentFolderId) {
      return {
        // files: getAllFiles(userFolders), // ใช้ฟังก์ชันที่สร้างเพื่อหาไฟล์ทั้งหมด
        files: [],
        folders: userFolders,
      };
    }
    return {
      files: currentFolder?.files || [],
      folders: currentFolder?.subFolders || [],
    };
  };

  const getCurrentPath = (
    folderId: string | null
  ): { id: string; name: string }[] => {
    const path: { id: string; name: string }[] = [];
    const findPath = (folders: IFolder[], targetId: string): boolean => {
      for (const folder of folders) {
        if (folder.id === targetId) {
          path.push({ id: folder.id, name: folder.name });
          return true;
        }
        if (folder.subFolders.length && findPath(folder.subFolders, targetId)) {
          path.unshift({ id: folder.id, name: folder.name });
          return true;
        }
      }
      return false;
    };
    if (folderId) findPath(userFolders, folderId);
    return path;
  };

  const searchByName = (
    name: string
  ): { folders: FolderWithRelations[]; files: File[] } => {
    const foundFolders: FolderWithRelations[] = [];
    const foundFiles: File[] = [];
    const searchRecursive = (folders: FolderWithRelations[]) => {
      for (const folder of folders) {
        if (folder.name.toLowerCase().includes(name.toLowerCase())) {
          foundFolders.push(folder);
        }
        folder.files.forEach((file) => {
          if (file.name.toLowerCase().includes(name.toLowerCase())) {
            foundFiles.push(file);
          }
        });
        searchRecursive(folder.subFolders);
      }
    };
    searchRecursive(userFolders);
    return { folders: foundFolders, files: foundFiles };
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchResults(query.trim() ? searchByName(query) : null);
  };

  const handleFolderClick = (folderId: string) => {
    setSearchQuery(""); // ล้างการค้นหาเมื่อเลือกโฟลเดอร์
    setSearchResults(null);
    setCurrentFolderId(folderId);
  };

  const handleSelectFile = (file: File) => setSelectedFile(file);

  return (
    <div className="flex flex-col sm:flex-row w-full overflow-hidden bg-background">
      <div className="hidden sm:block h-auto sm:h-[calc(100vh-4rem)] border-r p-4">
        <TreeView
          userFolders={userFolders}
          currentFolderId={currentFolderId}
          onSelectFolder={handleFolderClick}
          onSelectFile={handleSelectFile}
        />
      </div>
      <div className="overflow-hidden flex-1 ">
        <div className="border-b">
          <div className="flex items-center justify-between  p-4">
            <Breadcrumb
              path={getCurrentPath(currentFolderId)}
              onNavigate={(newPath) => {
                setSearchQuery("");
                setCurrentFolderId(newPath ? newPath.id : null);
              }}
            />
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="ค้นหา..."
                  className="pl-8 pr-4"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {currentFolderId && (
                <div className="flex items-center space-x-1">
                  {limitBytes - totalBytes > 0 && (
                    <FileUploadForm folderId={currentFolderId} />
                  )}
                  <FolderForm
                    userId={userId}
                    currentFolderId={currentFolderId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <ContentArea
          totalBytes={totalBytes}
          limitBytes={limitBytes}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSelectFile={handleSelectFile}
          onFolderClick={handleFolderClick}
          currentFolderId={currentFolderId}
          folders={
            searchResults
              ? searchResults.folders
              : getCurrentFolderContent().folders
          }
          files={
            searchResults
              ? searchResults.files
              : getCurrentFolderContent().files
          }
        />
      </div>
      <DetailsPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
    </div>
  );
}
