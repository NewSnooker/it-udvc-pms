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
    <div className="bg-background rounded-lg border shadow-inner bg-zinc-100 dark:bg-zinc-900">
      <div className="flex justify-between items-center rounded-t-lg overflow-hidden font-normal pl-4 pr-1 py-1 sm:pl-5 sm:pr-4 sm:py-2 bg-zinc-900/90 dark:bg-zinc-950/50 text-white border-b">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold">{status.title}</span>
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
                  <DraggableItem key={task.id} task={task} index={index} />
                ))}
              {provided.placeholder}
            </ScrollArea>
          )}
        </Droppable>
      </div>
    </div>
  );
}
