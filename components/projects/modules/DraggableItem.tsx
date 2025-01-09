import React, { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";
import TaskForm from "@/components/Forms/TaskForm";
import { Task } from "@/types/types";

interface DraggableItemProps {
  task: Task;
  index: number;
}

export default memo(function DraggableItem({
  task,
  index,
}: DraggableItemProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`transition-all duration-200 ${
            snapshot.isDragging ? "opacity-50 rotate-3 scale-105" : ""
          } ${snapshot.isDropAnimating ? "opacity-50 rotate-3 scale-105" : ""}
          }`}
        >
          <div className="flex items-center justify-between pl-4 pr-1 py-1 bg-card hover:bg-accent/5 rounded-lg border border-border/40 hover:border-border/80 shadow-sm mb-2 transition-all group">
            <span className="text-xs sm:text-sm font-medium line-clamp-1">
              {task.title}
            </span>
            <TaskForm
              moduleId={task.moduleId}
              initialStatus={task.status}
              initialTitle={task.title}
              editingId={task.id}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
});
