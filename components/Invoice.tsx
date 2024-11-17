"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import moment from "moment";
import "moment/locale/th";
import Link from "next/link";
import { ArrowLeft, Loader, Mail, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceDetails } from "@/types/types";
import { useReactToPrint } from "react-to-print";
import { UserRole } from "@prisma/client";
import { sendInvoiceLink } from "@/actions/emails";
import toast from "react-hot-toast";
moment.locale("th");
export default function Invoice({
  invoiceDetails,
  project,
  role,
}: {
  invoiceDetails: InvoiceDetails;
  project: string;
  role: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const invoiceLink = `${baseUrl}/project/invoice/${invoiceDetails.invoice.id}?project=${project}`;
  async function handleSendInvoice() {
    try {
      setLoading(true);
      const res = await sendInvoiceLink(invoiceDetails, invoiceLink);
      setLoading(false);
      toast.success("ส่งอีเมลสําเร็จ");
    } catch (error) {
      toast.error("ส่งอีเมลไม่สําเร็จ");
      setLoading(false);
      console.error(error);
    }
  }
  return (
    <div className="sm:container mt-4">
      <div className="flex flex-col sm:flex-row items-start justify-between mx-2 sm:mx-0">
        <Link href={`/project/${project}`}>
          <Button variant="outline" className=" mb-2 sm:mb-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปยังหน้าโครงการ
          </Button>
        </Link>
        <div className=" flex items-center justify-center sm:justify-end gap-x-2 w-full">
          {role === UserRole.USER && (
            <Button
              disabled={loading}
              variant="outline"
              onClick={handleSendInvoice}
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}

              {loading ? "Sending..." : "Send to Client"}
            </Button>
          )}
          <Button onClick={() => reactToPrintFn()}>
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      <div className="max-w-4xl sm:max-w-2xl  mx-auto p-2 sm:p-8">
        <div
          ref={contentRef}
          className="relative flex flex-col bg-white shadow-lg rounded-xl pointer-events-auto dark:bg-neutral-800"
        >
          <div className="relative overflow-hidden min-h-32 bg-zinc-900 text-center rounded-t-xl dark:bg-neutral-950">
            <figure className="absolute inset-x-0 bottom-0 -mb-px">
              <svg
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 1920 100.1"
              >
                <path
                  fill="currentColor"
                  className="fill-white dark:fill-neutral-800"
                  d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                ></path>
              </svg>
            </figure>
          </div>

          <div className="relative z-10 -mt-12">
            <Image
              src={invoiceDetails?.user?.userLogo ?? "/placeholder.svg"}
              width={100}
              height={100}
              alt="logo"
              className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400"
            />
          </div>

          <div className="p-4 sm:p-7 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="">
                <h3
                  id="hs-ai-modal-label"
                  className="text-lg font-semibold text-zinc-800 dark:text-neutral-200"
                >
                  จาก
                </h3>
                <p className="text-sm text-zinc-500 dark:text-neutral-500">
                  {invoiceDetails?.user?.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-neutral-500">
                  {invoiceDetails?.user?.email}
                </p>
                <p className="text-sm text-zinc-500 dark:text-neutral-500 mt-3">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    วันที่ใบเสร็จ:{" "}
                  </span>
                  {moment(invoiceDetails?.invoice.date).format("LL")}
                </p>
              </div>
              <div className="">
                <h3
                  id="hs-ai-modal-label"
                  className="text-lg font-semibold text-zinc-800 dark:text-neutral-200"
                >
                  ถึง
                </h3>
                <p className="text-sm text-zinc-500 dark:text-neutral-500">
                  {invoiceDetails?.client?.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-neutral-500">
                  {invoiceDetails?.client?.email}
                </p>
                <p className="text-sm text-zinc-500 dark:text-neutral-500 mt-3">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    รหัส #{" "}
                  </span>
                  {invoiceDetails?.invoice.invoiceNumber}
                </p>
              </div>
            </div>

            <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <span className="block text-xs uppercase text-zinc-500 dark:text-neutral-500">
                  จำนวนเงินที่ชำระเงิน:
                </span>
                <span className="block text-sm font-medium text-zinc-800 dark:text-neutral-200">
                  {invoiceDetails?.invoice.amount.toLocaleString()} บาท
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase text-zinc-500 dark:text-neutral-500">
                  วันที่ชำระเงิน:
                </span>
                <span className="block text-sm font-medium text-zinc-800 dark:text-neutral-200">
                  {moment(invoiceDetails?.invoice.date).format("L")}
                </span>
              </div>

              <div>
                <span className="block text-xs uppercase text-zinc-500 dark:text-neutral-500">
                  ช่องทางการชำระเงิน:
                </span>
                <div className="flex items-center gap-x-2">
                  <span className="block text-sm font-medium text-zinc-800 dark:text-neutral-200">
                    {invoiceDetails?.invoice.method}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-10">
              <h4 className="text-xs font-semibold uppercase text-zinc-800 dark:text-neutral-200">
                สรุปค่าใช้จ่าย
              </h4>

              <ul className="mt-3 flex flex-col">
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-zinc-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                  <div className="flex items-center justify-between w-full">
                    <span>{invoiceDetails?.invoice.title}</span>
                    <span>
                      {(
                        invoiceDetails!.invoice.amount -
                        invoiceDetails!.invoice.tax
                      ).toLocaleString()}{" "}
                      บาท
                    </span>
                  </div>
                </li>
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-zinc-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
                  <div className="flex items-center justify-between w-full">
                    <span>ภาษี</span>
                    <span>
                      {invoiceDetails?.invoice.tax.toLocaleString()} บาท
                    </span>
                  </div>
                </li>
                <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-zinc-50 border text-zinc-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                  <div className="flex items-center justify-between w-full">
                    <span>รวม</span>
                    <span>
                      {invoiceDetails?.invoice.amount.toLocaleString()} บาท
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-5 sm:mt-10">
              <p className="text-sm text-zinc-500 dark:text-neutral-500">
                หากคุณมีคำถามใด ๆ กรุณาติดต่อเราได้ที่{" "}
                <Link
                  href={`mailto:${invoiceDetails?.user?.email}`}
                  className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                >
                  {invoiceDetails?.user?.email}
                </Link>{" "}
                หรือโทรได้ที่{" "}
                <Link
                  className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                  href={`tel:$${invoiceDetails?.user?.phone}`}
                >
                  {invoiceDetails?.user?.phone}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
