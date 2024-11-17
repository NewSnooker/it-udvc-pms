import { getInvoiceById } from "@/actions/payment";

import { notFound, redirect } from "next/navigation";
import React from "react";
import Invoice from "@/components/Invoice";
import { getAuthUser } from "@/config/getAuthUser";

export default async function page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getAuthUser();
  const role = user?.role;

  const { project } = searchParams;
  if (!id) {
    return notFound();
  }
  const invoiceDetails = await getInvoiceById(id);
  if (!invoiceDetails?.client || !invoiceDetails?.user) {
    return notFound();
  }
  // const returnUrl = `/project/invoice/${id}?project=${project}`;
  // if (!user) {
  //   redirect(`/login?returnUrl=${returnUrl}`);
  // }
  return (
    <Invoice
      role={role as string}
      invoiceDetails={invoiceDetails}
      project={project as string}
    />
  );
}
