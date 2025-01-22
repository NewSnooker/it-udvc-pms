"use client";

import React from "react";
import DataTable from "@/components/DataTableComponents/DataTable";
import { Project } from "@prisma/client";

import { useState } from "react";
import { createColumns } from "@/app/(dashboard)/dashboard/projects/columns";

interface ProjectTableProps {
  initialData: Project[];
}

export default function ProjectTableClient({ initialData }: ProjectTableProps) {
  // สร้าง state object สำหรับแต่ละ project
  const [projectStatuses, setProjectStatuses] = useState(() =>
    initialData.reduce((acc, project) => {
      acc[project.id] = {
        status: project.isSuccessStatus,
        setStatus: (newStatus: boolean) => {
          setProjectStatuses((prev) => ({
            ...prev,
            [project.id]: {
              ...prev[project.id],
              status: newStatus,
            },
          }));
        },
      };
      return acc;
    }, {} as { [key: string]: { status: boolean; setStatus: (status: boolean) => void } })
  );

  const columns = createColumns(projectStatuses);

  return <DataTable data={initialData} columns={columns} />;
}
