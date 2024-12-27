import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
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
import { File } from "@prisma/client";
export interface IFile {
  id: string;
  key: string;
  name: string;
  type: string;
  url: string;
  size: number;
  parentFolderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFolder {
  id: string;
  name: string;
  userId: string;
  parentFolderId?: string | null;
  subFolders: IFolder[];
  files: IFile[];
  createdAt: Date;
  updatedAt: Date;
}

interface TreeNodeProps {
  folder: IFolder;
  depth: number;
  activeFolderId: string | null;
  onSelectFolder: (folderId: string) => void;
  onSelectFile: (file: File) => void;
}

function TreeNode({
  folder,
  depth,
  activeFolderId,
  onSelectFolder,
  onSelectFile,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = activeFolderId === folder.id;

  useEffect(() => {
    const shouldOpen = folder.subFolders?.some(
      (subFolder) => subFolder.id === activeFolderId
    );
    if (shouldOpen && !isOpen) {
      setIsOpen(true);
    }
  }, [activeFolderId, folder.subFolders, isOpen]);
  const getFileIcon = (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return (
          <FaFilePdf className="w-4 h-4 flex-shrink-0 mr-2 text-red-500" />
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaImage className="w-4 h-4 flex-shrink-0 mr-2 text-gray-600" />;
      case "doc":
      case "docx":
        return (
          <FaFileWord className="w-4 h-4 flex-shrink-0 mr-2 text-blue-500" />
        );
      case "xls":
      case "xlsx":
        return (
          <FaFileExcel className="w-4 h-4 flex-shrink-0 mr-2 text-green-500" />
        );
      case "ppt":
      case "pptx":
        return (
          <FaFilePowerpoint className="w-4 h-4 flex-shrink-0 mr-2 text-orange-500" />
        );
      case "zip":
      case "gzip":
      case "tar":
        return (
          <FaFileArchive className="w-4 h-4 flex-shrink-0 mr-2 text-yellow-600" />
        );
      case "txt":
        return (
          <MdTextSnippet className="w-4 h-4 flex-shrink-0 mr-2 text-gray-500" />
        );
      default:
        return (
          <FaFileAlt className="w-4 h-4 flex-shrink-0 mr-2 text-gray-500" />
        ); // Default icon for other file types
    }
  };
  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
          isActive ? "bg-accent text-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => {
          onSelectFolder(folder.id);
          setIsOpen(true);
        }}
      >
        <span
          className="mr-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        {isOpen ? (
          <FolderOpen size={16} className="mr-2" />
        ) : (
          <Folder size={16} className="mr-2" />
        )}
        <span className="text-sm">{folder.name}</span>
      </div>
      {isOpen && (
        <div>
          {/* Subfolders */}
          {folder.subFolders &&
            folder.subFolders.length > 0 &&
            folder.subFolders.map((subFolder) => (
              <TreeNode
                key={subFolder.id}
                folder={subFolder}
                depth={depth + 1}
                activeFolderId={activeFolderId}
                onSelectFolder={onSelectFolder}
                onSelectFile={onSelectFile}
              />
            ))}
          {/* Files */}
          {folder.files &&
            folder.files.length > 0 &&
            folder.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center py-1 px-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                style={{ paddingLeft: `${(depth + 1) * 16}px` }}
                onClick={() => {
                  onSelectFile(file);
                  onSelectFolder(folder.id);
                }}
              >
                <span className=" ml-2">{getFileIcon(file as File)}</span>
                <span className="line-clamp-1">{file.name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

interface TreeViewProps {
  currentFolderId: string | null;
  onSelectFolder: (folderId: string) => void;
  onSelectFile: (file: File) => void;
  userFolders: IFolder[];
}

export function TreeView({
  currentFolderId,
  onSelectFolder,
  onSelectFile,
  userFolders,
}: TreeViewProps) {
  const rootFolders = userFolders.filter((folder) => !folder.parentFolderId);

  return (
    <div className="overflow-auto h-full w-64 sm:h-full ">
      {rootFolders.length > 0 ? (
        rootFolders.map((folder) => (
          <TreeNode
            key={folder.id}
            folder={folder}
            depth={0}
            activeFolderId={currentFolderId}
            onSelectFolder={onSelectFolder}
            onSelectFile={onSelectFile}
          />
        ))
      ) : (
        <div className="text-center text-muted-foreground mt-4">
          ไม่มีโฟลเดอร์ที่จะแสดง
        </div>
      )}
    </div>
  );
}
