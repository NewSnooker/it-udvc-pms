import React from "react";
import SectionHeading from "./global/SectionHeading";
import FeaturesCard from "./FeaturesCard";
import { WEBSITE_NAME } from "@/constants";

export default function ComparisonFeatures() {
  const cons = [
    "ใช้เวลามากในการอัปเดตสถานะโครงการ",
    "ข้อมูลกระจัดกระจายในหลายแพลตฟอร์ม",
    "ยากต่อการติดตามความคืบหน้าแบบเรียลไทม์",
  ];
  const pros = [
    "อัปเดตสถานะโครงการอย่างรวดเร็ว",
    "ข้อมูลทั้งหมดรวมอยู่ในที่เดียว ค้นหาง่าย",
    "ติดตามความคืบหน้าได้ทันที",
  ];
  return (
    <div className="text-center ">
      <div className="pb-4">
        <SectionHeading title="เบื่อกับการจัดการโครงการแบบเดิมๆรึยัง?" />
      </div>
      <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FeaturesCard
          features={cons}
          isPros={false}
          title="การจัดการโครงการแบบดั้งเดิม"
        />
        <FeaturesCard
          features={pros}
          isPros={true}
          title={`การจัดการโครงการด้วย ${WEBSITE_NAME} ของเรา`}
        />
      </div>
    </div>
  );
}
