import TaskForm from "@/components/Forms/TaskForm";
import { Task, TaskStatus } from "@prisma/client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import DraggableItem from "./DraggableItem";

export default function Column({
  moduleId,
  tasks,
  status,
  activeId,
}: {
  moduleId: string;
  tasks: Task[];
  status: { title: string; status: TaskStatus };
  activeId: string | null;
}) {
  const { setNodeRef } = useDroppable({
    id: status.status,
  });
  return (
    <div className="bg-background rounded-lg border shadow-inner bg-zinc-100 dark:bg-zinc-900 ">
      <div className="flex justify-between items-center rounded-t-lg overflow-hidden font-normal pl-5 pr-4 py-2 bg-zinc-900/90 dark:bg-zinc-950/50 text-white border-b">
        <span>{status.title}</span>
        <TaskForm
          moduleId={moduleId}
          initialStatus={status.status}
          titleStatus={status.title}
        />
      </div>
      <div className="p-3">
        <ScrollArea ref={setNodeRef} className="h-[calc(100vh-18rem)]">
          {tasks
            .filter((task) => task.status === status.status)
            .map((task) => (
              <DraggableItem
                key={task.id}
                id={task.id}
                task={task}
                isDragging={activeId === task.id}
              />
            ))}
        </ScrollArea>
      </div>
    </div>
  );
}
