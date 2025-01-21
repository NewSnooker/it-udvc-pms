/* eslint-disable react-hooks/exhaustive-deps */
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
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { MailIcon } from "lucide-react";
interface TaskBoardProps {
  activeModule: ModuleData;
  status: Array<{ title: string; status: TaskStatus }>;
  isOwner: boolean;
  isGuest: boolean;
  isClient: boolean;
}

export default function TaskBoard({
  activeModule,
  status,
  isOwner,
  isGuest,
  isClient,
}: TaskBoardProps) {
  const confettiRef = useRef<ConfettiRef>(null);
  const [module, setModule] = useState<ModuleData>(activeModule);
  const [initialCompletion, setInitialCompletion] = useState<number | null>(
    null
  );
  const { toast } = useToast();
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

  // เก็บค่าเปอร์เซ็นต์ครั้งแรกที่โหลด
  useEffect(() => {
    if (initialCompletion === null) {
      setInitialCompletion(percentageCompletion);
    }
  }, []);

  const handleDragStart = (initial: DragStart) => {
    // Optional: Add any drag start logic here
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

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
    // เล่นเสียงเฉพาะเมื่อ:
    // 1. มีค่า initialCompletion แล้ว (ไม่ใช่ null)
    // 2. initialCompletion ไม่ใช่ 100%
    // 3. percentageCompletion เพิ่งถึง 100%
    if (
      initialCompletion !== null &&
      initialCompletion < 100 &&
      percentageCompletion === 100
    ) {
      const sound = new Howl({
        src: ["/success.mp3"],
        volume: 0.1,
        onend: () => {
          console.log("Finished!");
        },
      });
      sound.play();
      if (isGuest) {
        toast({
          title: "งานเสร็จสิ้นหมดแล้ว✨🎊",
          description: `งานของคุณเสร็จสิ้นหมดแล้วแล้ว\n (${activeModule.name}) \nคุณสามารถติดต่อกับเจ้าของโครงการของคุณได้ที่นี่`,
          action: (
            <ToastAction altText="ติดต่อ">
              <MailIcon className="mr-1.5 h-4 w-4" />
              <Link
                href={`/dashboard/emails?mail=${activeModule.user?.email}&role=owner`}
              >
                ติดต่อ
              </Link>{" "}
            </ToastAction>
          ),
        });
      }
    }
  }, [percentageCompletion, initialCompletion]);

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="text-xl sm:text-3xl text-center sm:text-left font-bold ">
        {`${activeModule.name} (${
          (activeModule.tasks && activeModule.tasks.length) || 0
        })`}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        {`แสดงสถานะการทำงานของ ${activeModule.name}`}{" "}
        {(isOwner || isGuest) && (
          <span className="hidden sm:inline">
            {`สามารถลากและวางเพื่อเปลี่ยนสถานะการทำงาน`}
          </span>
        )}
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
                isOwner={isOwner}
                isGuest={isGuest}
                isClient={isClient}
              />
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
