import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import InviteClient from "../DataTableColumns/InviteClient";
import { ClientData, ProjectData } from "@/types/types";
import { User } from "@prisma/client";
import Link from "next/link";

export default function CardUserDetail({
  title,
  isInviteClient,
  user,
  projectData,
}: {
  title: string;
  isInviteClient: boolean;
  user: User | ClientData | null;
  projectData: ProjectData;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex items-center space-x-4 mb-2 sm:mb-4  ">
          <Avatar className="h-10 w-10 ">
            <AvatarImage
              src={user?.image ?? "/placeholder.svg"}
              alt="Space Corp"
            />
            <AvatarFallback>
              {user?.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">
                บริษัท {user?.companyName || "ยังไม่ได้ระบุ"}
              </p>
            </div>
          </div>
          {isInviteClient && (
            <div className=" hidden sm:inline-block">
              <InviteClient row={projectData} />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p>
            <strong>อีเมล: </strong>
            <Link
              target="_blank"
              href={`mailto:${user?.email}`}
              className="underline text-blue-600 hover:text-blue-800"
            >
              {user?.email}
            </Link>
          </p>
          <p>
            <strong>เบอร์โทร: </strong>
            {user?.phone}
          </p>
          <p>
            <strong>ที่อยู่: </strong>
            {user?.location}
          </p>
        </div>
        {isInviteClient && (
          <div className="w-full mt-2 sm:hidden">
            <InviteClient row={projectData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
