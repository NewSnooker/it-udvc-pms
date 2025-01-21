import { getProjectModules } from "@/actions/module";
import ModuleForm from "@/components/Forms/ModuleForm";
import AuthenticatedAvatar from "@/components/global/AuthenticatedAvatar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/config/auth";
import { Module } from "@/types/types";
import { ArrowLeft, Circle, CircleDashed } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Task, TaskStatus } from "@prisma/client";
import TaskBoard from "@/components/projects/modules/TaskBoard";
import { getProjectAndGuestByModuleId } from "@/actions/guestProject";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculatePercentageCompletion } from "@/lib/calculatePercentageCompletionTask";
export const metadata = {
  title: "ฟีเจอร์โครงการ",
};
export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const status = [
    {
      title: "งานที่ต้องทำ",
      status: TaskStatus.TODO,
    },
    {
      title: "กำลังดำเนินการ",
      status: TaskStatus.INPROGRESS,
    },
    {
      title: "ทำเสร็จแล้ว",
      status: TaskStatus.COMPLETE,
    },
  ];
  const returnUrl = `/project/modules/${id}?pid=${searchParams.pid}`;
  if (!session) {
    redirect(`/login?returnUrl=${returnUrl}`);
  }
  const projectData = await getProjectAndGuestByModuleId(id as string);
  if (!projectData) {
    return notFound();
  }
  const isGuest = projectData.guestProject
    ?.map((gp) => gp.guestId)
    .includes(session.user.id);
  const isOwner = projectData.userId === session.user.id;
  const isClient = projectData.clientId === session.user.id;

  if (!isGuest && !isOwner && !isClient) {
    return notFound();
  }

  const modules = (await getProjectModules(searchParams.pid as string)) || [];
  const activeModule = modules?.find((module) => module.id === id);
  if (!activeModule || modules.length === 0) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="px-4 sm:container mx-auto pt-4 space-y-2 sm:space-y-6">
        <div className="mb-2 sm:mb-4 flex items-center justify-between w-full">
          <Link
            href={`/project/${projectData.slug}`}
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปยังหน้าโครงการ
            </Button>
          </Link>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-2">
            <ModeToggle />
            <AuthenticatedAvatar session={session} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:gap-4 lg:grid-cols-12 bg-background rounded-lg sm:rounded-3xl border text-card-foreground shadow-xl overflow-hidden sm:min-h-[38rem] w-full">
          <div className="hidden sm:block lg:col-span-3 p-2 sm:p-8 lg:border-r lg:shadow-xl ">
            <div className="flex flex-col justify-between h-full ">
              <div className="">
                <div className="w-full text-xl text-center sm:text-left sm:text-2xl font-bold mb-2 mt-6 sm:mt-0 sm:mb-2">
                  ฟีเจอร์โครงการ
                </div>
                {modules?.length > 0 ? (
                  modules.map((module: Module) => {
                    // คำนวณเปอร์เซ็นต์สำหรับแต่ละ module
                    const modulePercentage = calculatePercentageCompletion(
                      module.tasks ?? []
                    );

                    return (
                      <div key={module.id} className="ease-in-out mb-1">
                        <Link
                          href={`/project/modules/${module.id}?pid=${searchParams.pid}`}
                        >
                          <Card
                            className={`w-full flex items-center gap-2 p-2 sm:px-3  ${
                              module.id === id
                                ? "bg-zinc-800 dark:bg-zinc-800 text-white dark:text-zinc-200"
                                : ""
                            }`}
                          >
                            <div className="">
                              {module.id === id ? (
                                <Circle className=" h-4 w-4" />
                              ) : (
                                <CircleDashed className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex flex-col w-full">
                              <span className={`line-clamp-1 text-xs`}>
                                {module.name}
                              </span>
                              {/* <span
                                className={`line-clamp-1 text-xs
                                  ${
                                    module.id === id
                                      ? "text-sm font-bold my-1.5"
                                      : ""
                                  }
                                `}
                              >
                                {module.name}
                              </span> */}
                              {/* {module.id !== id && ( */}
                              <div className="w-full flex flex-col sm:flex-row items-center ">
                                <div className="flex items-center w-full">
                                  <Progress value={modulePercentage} />
                                  <span
                                    className={`ml-2 text-xs text-muted-foreground ${
                                      module.id === id
                                        ? "text-white dark:text-zinc-200"
                                        : ""
                                    }`}
                                  >{`${modulePercentage}%`}</span>
                                </div>
                              </div>
                              {/* )} */}
                            </div>
                          </Card>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div>ไม่พบฟีเจอร์โครงการ</div>
                )}
              </div>
              {isOwner && (
                <ModuleForm
                  projectId={projectData.id}
                  userId={user.id}
                  userName={user.name}
                />
              )}
            </div>
          </div>
          <div className="lg:col-span-9 py-4 sm:py-8 px-4 sm:px-16 bg-zinc-50 dark:bg-zinc-950  ">
            <TaskBoard
              activeModule={activeModule}
              status={status}
              isOwner={isOwner}
              isGuest={isGuest}
              isClient={isClient}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
