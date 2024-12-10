"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/generateInitials";
import { User } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import emptyClient from "@/public/images/users-avatar.png";

export default function RecentClients({
  recentClients,
}: {
  recentClients: User[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between ">
        <CardTitle>ลูกค้าล่าสุด</CardTitle>
        <Link href="/dashboard/clients">
          <Button size="sm" className="ml-auto gap-1">
            <span className="hidden sm:inline">เพิ่มเติม</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentClients?.length > 0 ? (
          recentClients.map((client) => (
            <div key={client.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage
                  src={
                    client.image ||
                    "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png"
                  }
                  alt={client.name}
                />
                <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {client.name}
                </p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
              <div className="text-sm ml-auto font-medium">{client.phone}</div>
            </div>
          ))
        ) : (
          <div className="w-full flex flex-col justify-center items-center sm:min-h-64">
            <div className="">
              <Image
                src={emptyClient}
                alt="empty"
                height={224}
                width={224}
                className="h-24 w-24  object-cover "
              />
              <p className="text-lg text-muted-foreground mt-4 mb-6">
                ไม่พบลูกค้า
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
