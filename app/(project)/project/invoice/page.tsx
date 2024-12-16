import { notFound } from "next/navigation";

export default function Page() {
  // เรียกใช้ notFound() ทันทีเมื่อโหลดหน้า
  notFound();

  // เนื้อหาด้านล่างจะไม่ถูกแสดงผล เพราะ notFound() จะ redirect
  return <div>page</div>;
}
