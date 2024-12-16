import { getProjectModules } from "@/actions/module";
import { getProjectById } from "@/actions/projects";
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
import { TaskStatus } from "@prisma/client";
import TaskBoard from "@/components/projects/modules/TaskBoard";
export const metadata = {
  title: "ฟังชั่นโครงการ",
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
  const projectData = await getProjectById(searchParams.pid as string);
  if (!projectData) {
    return <div> ไม่พบโครงการ </div>;
  }
  const modules = (await getProjectModules(searchParams.pid as string)) || [];
  const activeModule = modules?.find((module) => module.id === id);
  if (!activeModule || modules.length === 0) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="container mx-auto pt-4 pb-10 space-y-6">
        <div className="mb-4 flex items-center justify-between w-full">
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
        <div className="grid grid-cols-1 sm:gap-4 lg:grid-cols-12 bg-background rounded-lg border text-card-foreground shadow-xl overflow-hidden sm:min-h-[38rem] w-full">
          <div className="hidden sm:block lg:col-span-3 p-2 sm:p-8 lg:border-r lg:shadow-xl lg:rounded-lg ">
            <div className="flex flex-col justify-between h-full ">
              <div className="">
                <div className="w-full text-xl text-center sm:text-left sm:text-2xl font-bold mb-4 mt-4 sm:mt-0 sm:mb-6">
                  ฟังก์ชั่นโครงการ
                </div>
                {modules?.length > 0 ? (
                  modules.map((module: Module) => (
                    <div key={module.id} className="ease-in-out">
                      <Link
                        href={`/project/modules/${module.id}?pid=${searchParams.pid}`}
                      >
                        <Button
                          variant={module.id === id ? "default" : "ghost"}
                          size="sm"
                          className="w-full px-2 sm:px-3 flex items-center justify-start sm:h-11 "
                        >
                          {module.id === id ? (
                            <Circle className="mr-1.5 sm:mr-2 h-4 w-4" />
                          ) : (
                            <CircleDashed className="mr-1.5 sm:mr-2 h-4 w-4" />
                          )}
                          <span className=" text-sm sm:text-base ">
                            {" "}
                            {module.name}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div>ไม่พบฟังก์ชั่นโครงการ</div>
                )}
              </div>
              <ModuleForm
                projectId={projectData.id}
                userId={user.id}
                userName={user.name}
              />
            </div>
          </div>
          <div className="lg:col-span-9 py-4 sm:py-8 px-4 sm:px-16 bg-zinc-50 dark:bg-zinc-950  ">
            <TaskBoard activeModule={activeModule} status={status} />
          </div>
        </div>
      </div>
    </div>
  );
}
