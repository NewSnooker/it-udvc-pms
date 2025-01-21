import TaskForm from "@/components/Forms/TaskForm";
import { Task, TaskStatus } from "@prisma/client";
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import DraggableItem from "./DraggableItem";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";

interface ColumnProps {
  moduleId: string;
  tasks: Task[];
  status: {
    title: string;
    status: TaskStatus;
  };
  isOwner: boolean;
  isGuest: boolean;
  isClient: boolean;
}

export default function Column({
  moduleId,
  tasks,
  status,
  isOwner,
  isGuest,
  isClient,
}: ColumnProps) {
  return (
    <div
      className={`rounded-lg border shadow-inner bg-zinc-100/20 dark:bg-zinc-900/50 `}
    >
      <div
        className={`flex justify-between items-center rounded-t-lg overflow-hidden font-normal
          pl-4 pr-1 py-1 sm:pl-5 sm:pr-4 sm:py-2 border-b
            ${
              status.status === TaskStatus.COMPLETE
                ? "text-green-600 dark:text-green-300 border-green-600/50 dark:border-green-800 bg-green-50 dark:bg-green-900/50"
                : status.status === TaskStatus.INPROGRESS
                ? "text-yellow-500 dark:text-yellow-300 border-yellow-500/50 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/50"
                : status.status === TaskStatus.TODO
                ? "text-zinc-600 dark:text-zinc-300 border-zinc-600/50 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50"
                : ""
            }`}
      >
        <div className={`flex items-center gap-2 `}>
          <span className={`text-xs sm:text-sm font-bold`}>{status.title}</span>
          <span className="text-xs sm:text-sm font-medium">
            {tasks.filter((task) => task.status === status.status).length}
          </span>
        </div>
        {isOwner && (
          <TaskForm
            moduleId={moduleId}
            initialStatus={status.status}
            titleStatus={status.title}
          />
        )}
        {(isGuest || isClient) && (
          <Button
            variant="ghost"
            size="icon"
            className=" transition-all opacity-0 "
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-2 sm:p-3">
        <Droppable droppableId={status.status}>
          {(provided) => (
            <ScrollArea
              ref={provided.innerRef}
              className="h-[calc(100vh-20rem)] sm:h-[calc(100vh-22rem)] "
              {...provided.droppableProps}
            >
              {tasks
                .filter((task) => task.status === status.status)
                .map((task, index) => (
                  <DraggableItem
                    key={task.id}
                    task={task}
                    index={index}
                    status={status.status}
                    isOwner={isOwner}
                    isGuest={isGuest}
                    isClient={isClient}
                  />
                ))}
              {provided.placeholder}
            </ScrollArea>
          )}
        </Droppable>
      </div>
    </div>
  );
}
