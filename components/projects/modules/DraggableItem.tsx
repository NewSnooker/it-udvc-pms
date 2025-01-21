import React, { memo, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import TaskForm from "@/components/Forms/TaskForm";
import { Task } from "@/types/types";
import { TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DraggableItemProps {
  task: Task;
  index: number;
  status: TaskStatus;
  isOwner: boolean;
  isGuest: boolean;
  isClient: boolean;
}

export default memo(function DraggableItem({
  task,
  index,
  status,
  isOwner,
  isGuest,
  isClient,
}: DraggableItemProps) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const handleTaskClick = (e: React.MouseEvent) => {
    // Prevent dialog from opening if clicking on TaskForm
    if ((e.target as HTMLElement).closest(".task-form")) {
      return;
    }
    if (isOwner || isGuest) {
      setIsAlertDialogOpen(true);
    }
  };

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <Draggable draggableId={task.id} index={index} isDragDisabled={isClient}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`transition-all duration-200 ${
              snapshot.isDragging ? "opacity-50 rotate-3 scale-105" : ""
            } ${
              snapshot.isDropAnimating ? "opacity-50 rotate-3 scale-105" : ""
            }`}
          >
            <div
              onClick={handleTaskClick}
              className={`flex items-center justify-between pl-3 pr-0.5 py-0.5 sm:pl-4 sm:pr-1 sm:py-1 bg-card hover:bg-accent/5 rounded-lg border shadow-md mb-2 transition-all group ${
                status === TaskStatus.COMPLETE
                  ? "border-green-600/50 dark:border-green-800"
                  : status === TaskStatus.INPROGRESS
                  ? "border-yellow-500/50 dark:border-yellow-800"
                  : status === TaskStatus.TODO
                  ? "border-zinc-600/50 dark:border-zinc-800"
                  : ""
              }`}
            >
              <span className="text-xs sm:text-sm font-medium line-clamp-1">
                {task.title}
              </span>
              {isOwner && (
                <div className="task-form" onClick={(e) => e.stopPropagation()}>
                  <TaskForm
                    moduleId={task.moduleId}
                    initialStatus={task.status}
                    initialTitle={task.title}
                    initialDetail={task.detail}
                    editingId={task.id}
                  />
                </div>
              )}
              {(isGuest || isClient) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-all opacity-0 ${
                    isClient ? "cursor-default" : ""
                  }`}
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </Draggable>

      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle>รายละเอียดงาน {task.title}</AlertDialogTitle>
          <AlertDialogDescription>{task.detail}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ปิด</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
