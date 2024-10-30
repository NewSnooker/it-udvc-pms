"use client";
import { Howl, Howler } from "howler";
import { ModuleData, Task } from "@/types/types";
import { TaskStatus } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import Column from "./Column";
import { Progress } from "@/components/ui/progress";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { updateTaskStatus } from "@/actions/tasks";
import DraggableItem from "./DraggableItem";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";

export default function TaskBoard({
  activeModule,
  status,
}: {
  activeModule: ModuleData;
  status: Array<{ title: string; status: TaskStatus }>;
}) {
  function calculatePercentageCompletion(tasks: Task[]): number {
    const allTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETE
    ).length;
    return allTasks === 0 ? 0 : Math.round((completedTasks / allTasks) * 100);
  }
  const confettiRef = useRef<ConfettiRef>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );
  const [module, setModule] = useState<ModuleData>(activeModule);
  const percentageCompletion = calculatePercentageCompletion(
    module.tasks ?? []
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (over && active.id !== over.id) {
      const activeTask = (module.tasks ?? []).find(
        (task) => task.id === active.id
      );
      const overContainer = over.id as TaskStatus;
      if (activeTask && activeTask.status !== overContainer) {
        const updatedTasks =
          module.tasks &&
          module.tasks.map((task) =>
            task.id === activeTask.id
              ? { ...task, status: overContainer }
              : task
          );
        setModule((prevModule) => ({
          ...prevModule,
          tasks: updatedTasks,
        }));

        try {
          // Update the database
          await updateTaskStatus(active.id as string, overContainer);
        } catch (error) {
          console.error("Error updating task status:", error);
          // Revert the optimistic update if the API call fails
          setModule((prevModule) => ({
            ...prevModule,
            tasks: activeModule.tasks,
          }));
        }
      }
    }
    setActiveId(null);
  };

  const activeTask = activeId
    ? module.tasks && module.tasks.find((task) => task.id === activeId)
    : null;

  useEffect(() => {
    setModule(activeModule);
  }, [activeModule]);
  useEffect(() => {
    if (percentageCompletion === 100) {
      // confettiRef.current?.fire({}); // เรียกใช้ฟังก์ชัน fire ของ Confetti
      const sound = new Howl({
        src: ["/success.mp3"],
        volume: 0.1,
        onend: () => {
          console.log("Finished!");
        },
      });
      sound.play();
      // เรียก Confetti เมื่อเปอร์เซ็นต์ถึง 100%
    }
  }, [percentageCompletion]); // ใช้เปอร์เซ็นต์เป็น dependency
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="text-xl sm:text-3xl text-center sm:text-left font-bold mb-2 ">
        {`${activeModule.name} (${
          (activeModule.tasks && activeModule.tasks.length) || 0
        })`}
      </div>
      <div className="w-full flex flex-col sm:flex-row items-center mb-4 sm:mb-4">
        <div className="flex items-center w-full  ">
          <Progress value={percentageCompletion} />
          <span className="ml-4 text-sm text-muted-foreground">{`${percentageCompletion}%`}</span>
        </div>
      </div>
      {/* <Confetti
        ref={confettiRef}
        className="absolute left-0 top-50 z-0 size-full"
      /> */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 ">
        {status.map((s, i) => (
          <Column
            key={i}
            moduleId={activeModule.id}
            tasks={module.tasks ?? []}
            status={s}
            activeId={activeId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId && activeTask ? (
          <DraggableItem id={activeId} task={activeTask} isDragging={false} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
