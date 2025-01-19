import { getInvoiceById } from "@/actions/payment";

import { notFound, redirect } from "next/navigation";
import React from "react";
import Invoice from "@/components/Invoice";
import { Metadata } from "next";
import { WEBSITE_NAME } from "@/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { getProjectAndGuestByPaymentId } from "@/actions/guestProject";
export async function generateMetadata({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!id) {
    return notFound();
  }
  const invoiceDetails = await getInvoiceById(id);
  if (!invoiceDetails?.client || !invoiceDetails?.user) {
    return notFound();
  }

  const title = `ใบเเจ้งหนี้ ${
    invoiceDetails?.client?.name.split(" ")[0]
  } | ${WEBSITE_NAME}`;
  const description = `แสดงรายละเอียดใบเเจ้งหนี้ของคุณ ${
    invoiceDetails?.client?.name
  } ในวันที่ ${invoiceDetails.invoice.date
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("-")} ในแพลตฟอร์มของเรา`;
  const url = `${baseUrl}/project/invoice/${id}?project=${searchParams.project}`;

  return {
    title: title,
    description: description,

    openGraph: {
      title: title,
      description: description,
      url: url,
      type: "website",
    },
  };
}
export default async function page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { project } = searchParams;

  const session = await getServerSession(authOptions);
  if (!project || !id) {
    return notFound();
  }
  const projectData = await getProjectAndGuestByPaymentId(id);
  const returnUrl = `/project/invoice/${id}?project=${project}`;
  if (!session) {
    redirect(`/login?returnUrl=${returnUrl}`);
  }
  if (!projectData) {
    return notFound();
  }
  const isGuest = projectData.guestProject
    ?.map((gp) => gp.guestId)
    .includes(session.user.id);
  const isOwner = projectData.userId === session.user.id;
  const isClient = projectData.clientId === session.user.id;

  if (!isGuest && !isOwner && !isClient) {
    return notFound();
  }

  const invoiceDetails = await getInvoiceById(id);
  if (!invoiceDetails?.client || !invoiceDetails?.user) {
    return notFound();
  }

  return (
    <Invoice
      role={session.user.role as string}
      invoiceDetails={invoiceDetails}
      project={project as string}
    />
  );
}
