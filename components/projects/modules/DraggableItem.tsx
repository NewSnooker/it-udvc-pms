import React, { CSSProperties, memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import TaskForm from "@/components/Forms/TaskForm";
import { Task } from "@/types/types";

interface DraggableProps {
  id: string;
  task: Task;
  isDragging: boolean;
}

export default memo(function DraggableItem({
  id,
  task,
  isDragging,
}: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={` transition-all duration-200 cursor-grabbing ${
        isDragging ? "opacity-0" : ""
      }`}
    >
      <div className="flex items-center justify-between pl-4 pr-1 py-1 bg-background rounded-lg border shadow-sm mb-2">
        <span className="text-sm font-medium line-clamp-1">{task.title}</span>
        <TaskForm
          moduleId={task.moduleId}
          initialStatus={task.status}
          initialTitle={task.title}
          editingId={task.id}
        />
      </div>
    </div>
  );
});
