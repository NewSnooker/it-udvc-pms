import TaskForm from "@/components/Forms/TaskForm";
import { Task, TaskStatus } from "@prisma/client";
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import DraggableItem from "./DraggableItem";

interface ColumnProps {
  moduleId: string;
  tasks: Task[];
  status: {
    title: string;
    status: TaskStatus;
  };
}

export default function Column({ moduleId, tasks, status }: ColumnProps) {
  return (
    <div
      className={`rounded-lg border shadow-inner  ${
        status.status === TaskStatus.COMPLETE
          ? " border-green-600 dark:border-green-800 bg-green-100/20 dark:bg-green-900/50"
          : status.status === TaskStatus.INPROGRESS
          ? " border-yellow-500 dark:border-yellow-800 bg-yellow-100/20 dark:bg-yellow-900/50"
          : status.status === TaskStatus.TODO
          ? " border-zinc-600 dark:border-zinc-800 bg-zinc-100/20 dark:bg-zinc-900/50"
          : ""
      }`}
    >
      <div
        className={`flex justify-between items-center rounded-t-lg overflow-hidden font-normal pl-4 pr-1 py-1 sm:pl-5 sm:pr-4 sm:py-2 text-white border-b   ${
          status.status === TaskStatus.COMPLETE
            ? "border-green-600 dark:border-green-800 bg-green-600/75 dark:bg-green-800  "
            : status.status === TaskStatus.INPROGRESS
            ? "border-yellow-500 dark:border-yellow-800 bg-yellow-500/75 dark:bg-yellow-800 "
            : status.status === TaskStatus.TODO
            ? "border-zinc-600 dark:border-zinc-800 bg-zinc-600/75 dark:bg-zinc-800"
            : ""
        }`}
      >
        <div className={`flex items-center gap-2 `}>
          <span className={`text-xs sm:text-sm font-bold`}>{status.title}</span>
          <span className="text-xs sm:text-sm font-medium">
            {tasks.filter((task) => task.status === status.status).length}
          </span>
        </div>
        <TaskForm
          moduleId={moduleId}
          initialStatus={status.status}
          titleStatus={status.title}
        />
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
