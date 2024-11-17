import React from "react";
import SectionHeading from "./global/SectionHeading";
import FeaturesCard from "./FeaturesCard";
import { WEBSITE_NAME } from "@/constants";

export default function ComparisonFeatures() {
  const cons = [
    "ใช้เวลามากในการอัปเดตสถานะโครงการ",
    "ข้อมูลกระจัดกระจายในหลายแพลตฟอร์ม",
    "การสื่อสารในทีมไม่มีประสิทธิภาพ",
    "ยากต่อการติดตามความคืบหน้าแบบเรียลไทม์",
    "รายงานต้องสร้างด้วยตนเอง ใช้เวลานาน",
  ];
  const pros = [
    "อัปเดตสถานะโครงการอัตโนมัติและรวดเร็ว",
    "ข้อมูลทั้งหมดรวมอยู่ในที่เดียว ค้นหาง่าย",
    "เครื่องมือสื่อสารภายในทีมแบบเรียลไทม์",
    "ติดตามความคืบหน้าได้ทันทีผ่านแดชบอร์ด",
    " สร้างรายงานอัตโนมัติด้วยคลิกเดียว",
  ];
  return (
    <div className="text-center ">
      <div className="pb-6">
        <SectionHeading title="เบื่อกับการจัดการโครงการแบบเดิมๆรึยัง?" />
      </div>
      <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FeaturesCard
          features={cons}
          title="การจัดการโครงการแบบดั้งเดิม"
          className="bg-red-50 text-red-800"
        />
        <FeaturesCard
          features={pros}
          title={`การจัดการโครงการด้วย ${WEBSITE_NAME} ของเรา`}
          className="bg-green-50 text-green-800"
        />
      </div>
    </div>
  );
}
