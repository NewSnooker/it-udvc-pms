"use client";
import { Howl } from "howler";
import { ModuleData, Task } from "@/types/types";
import { TaskStatus } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import Column from "./Column";
import { Progress } from "@/components/ui/progress";
import { DragDropContext, DropResult, DragStart } from "@hello-pangea/dnd";
import { updateTaskStatus } from "@/actions/tasks";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";

interface TaskBoardProps {
  activeModule: ModuleData;
  status: Array<{ title: string; status: TaskStatus }>;
}

export default function TaskBoard({ activeModule, status }: TaskBoardProps) {
  const confettiRef = useRef<ConfettiRef>(null);
  const [module, setModule] = useState<ModuleData>(activeModule);

  function calculatePercentageCompletion(tasks: Task[]): number {
    const allTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === TaskStatus.COMPLETE
    ).length;
    return allTasks === 0 ? 0 : Math.round((completedTasks / allTasks) * 100);
  }

  const percentageCompletion = calculatePercentageCompletion(
    module.tasks ?? []
  );

  const handleDragStart = (initial: DragStart) => {
    // Optional: Add any drag start logic here
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Drop outside the list
    if (!destination) return;

    // Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as TaskStatus;
    const activeTask = (module.tasks ?? []).find(
      (task) => task.id === draggableId
    );

    if (activeTask && activeTask.status !== newStatus) {
      const updatedTasks =
        module.tasks &&
        module.tasks.map((task) =>
          task.id === draggableId ? { ...task, status: newStatus } : task
        );

      setModule((prevModule) => ({
        ...prevModule,
        tasks: updatedTasks,
      }));

      try {
        await updateTaskStatus(draggableId, newStatus);
      } catch (error) {
        console.error("Error updating task status:", error);
        setModule((prevModule) => ({
          ...prevModule,
          tasks: activeModule.tasks,
        }));
      }
    }
  };

  useEffect(() => {
    setModule(activeModule);
  }, [activeModule]);

  useEffect(() => {
    if (percentageCompletion === 100) {
      const sound = new Howl({
        src: ["/success.mp3"],
        volume: 0.1,
        onend: () => {
          console.log("Finished!");
        },
      });
      sound.play();
    }
  }, [percentageCompletion]);

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="text-xl sm:text-3xl text-center sm:text-left font-bold ">
        {`${activeModule.name} (${
          (activeModule.tasks && activeModule.tasks.length) || 0
        })`}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        {`แสดงสถานะการทำงานของ ${activeModule.name}`}{" "}
        <span className="hidden sm:inline">
          {`สามารถลากและวางเพื่อเปลี่ยนสถานะการทำงาน`}
        </span>
      </p>
      <div className="w-full flex flex-col sm:flex-row items-center my-1 sm:my2 ">
        <div className="flex items-center w-full">
          <Progress value={percentageCompletion} />
          <span className="ml-4 text-sm text-muted-foreground">{`${percentageCompletion}%`}</span>
        </div>
      </div>
      <div className="w-full flex-1 overflow-x-auto">
        <div className="flex flex-row sm:grid sm:grid-cols-3 gap-2 sm:gap-6 min-w-max sm:min-w-0 p-1">
          {status.map((s, i) => (
            <div key={i} className="w-[60vw] sm:w-auto">
              <Column
                moduleId={activeModule.id}
                tasks={module.tasks ?? []}
                status={s}
              />
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
