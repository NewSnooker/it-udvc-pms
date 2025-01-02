import { getUserById } from "@/actions/users";
import PublicClientForm from "@/components/Forms/PublicClientForm";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const user = await getUserById(params.userId);
  const title = "ลงทะเบียนลูกค้า";
  const url = `${baseUrl}/clients/new/${params.userId}`;
  const description = `แบบฟอร์มนี้ใช้สําหรับการลงทะเบียนลูกค้าของ ${user?.name}
    จากบริษัท ${user?.companyName} เท่านั้น
    กรุณากรอกข้อมูลที่จำเป็นอย่างครบถ้วน เช่น ชื่อ ที่อยู่ เบอร์โทรศัพท์ และข้อมูลอื่นๆ ที่เกี่ยวข้อง
    เพื่อให้สามารถให้บริการได้อย่างถูกต้องและรวดเร็ว นอกจากนี้ โปรดตรวจสอบข้อมูลที่กรอกให้แน่ใจว่าถูกต้อง
    เพื่อป้องกันปัญหาในอนาคตและเพิ่มความสะดวกในการให้บริการ`;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      site: url,
    },
  };
}
export default async function page({ params }: { params: { userId: string } }) {
  if (!params.userId) {
    notFound();
  }
  const user = await getUserById(params.userId);
  return (
    <div className="p-8">
      <div className="flex flex-col max-w-5xl mx-auto gap-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center sm:text-left">
          ลงทะเบียนลูกค้า
        </h1>
        <p className=" sm:hidden text-xs sm:text-sm text-muted-foreground ">
          แบบฟอร์มนี้ใช้สําหรับการลงทะเบียนลูกค้าของ <br />
          <b>{user?.name}</b>
          จากบริษัท <b>{user?.companyName}</b> เท่านั้น
          <br /> กรุณากรอกข้อมูลอย่างครบถ้วน
          และถูกต้องเพื่อความสะดวกในการให้บริการ
        </p>
        <p className=" hidden sm:block text-xs sm:text-sm text-muted-foreground ">
          แบบฟอร์มนี้ใช้สําหรับการลงทะเบียนลูกค้าของ <b>{user?.name}</b>
          จากบริษัท <b>{user?.companyName}</b> เท่านั้น
          <br /> กรุณากรอกข้อมูลอย่างครบถ้วน
          และถูกต้องเพื่อความสะดวกในการให้บริการ
        </p>
      </div>

      <PublicClientForm userId={params.userId} />
    </div>
  );
}
