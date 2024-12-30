"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="container max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-center items-center py-12">
      <Card className="w-full text-center shadow-none border-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            ไม่พบหน้าที่ค้นหา
          </CardTitle>
          <CardDescription className="text-xl font-semibold">
            ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            อาจเป็นไปได้ว่าคุณพิมพ์ที่อยู่ผิด หรือหน้านี้ถูกลบออกไปแล้ว
            <br /> กรุณาลองใหม่อีกครั้ง หรือกลับไปยังหน้าหลัก
          </p>

          <Image
            className="mx-auto w-96 rounded-lg"
            src="/404.jpg"
            width={740}
            height={740}
            alt="404 - ไม่พบหน้าที่ค้นหา"
            priority
          />

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              ย้อนกลับ
            </Button>

            <Button asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                กลับหน้าหลัก
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
