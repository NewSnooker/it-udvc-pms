"use client";

import type React from "react";
import { Mail } from "lucide-react";
import Logo from "../global/Logo";
import { WEBSITE_NAME } from "@/constants";

const Footer = ({ email }: { email: string }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-800 pt-16 pb-12" id="ติดต่อ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Logo href="/" title={WEBSITE_NAME} />
            <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              โครงการพัฒนาเว็บไซต์ที่เกิดขึ้นจากความมุ่งมั่นและความคิดสร้างสรรค์ของนักศึกษาวิทยาลัยอาชีวศึกษาอุดรธานี
              (UDVC) ประจำปีการศึกษา 2568
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase mb-4">
              หน้า
            </h3>
            <ul className=" flex items-center gap-3 text-base">
              {["หน้าหลัก", "เกี่ยวกับ", "ติดต่อ"].map((item) => (
                <li key={item}>
                  <a
                    href={`${baseUrl}#${item === "หน้าหลัก" ? "" : item}`}
                    className=" text-zinc-600 hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase mb-4">
              ติดต่อเรา
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-zinc-600 hover:text-blue-600 transition-colors">
                <Mail size={16} className="mr-2  text-zinc-400 " />
                <a
                  href={`mailto:${email}`}
                  className=" text-zinc-600 hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-8">
        <div className="flex items-center justify-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © 2024 {WEBSITE_NAME}. สงวนลิขสิทธิ์ทั้งหมด
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
