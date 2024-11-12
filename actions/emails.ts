"use server";
import { getNormalDate } from "@/lib/getNormalDate";
import { InvoiceDetails } from "@/types/types";
import { Resend } from "resend";
import { InvoiceLink } from "@/components/email-templates/InvoiceLink";

export async function sendInvoiceLink(
  data: InvoiceDetails,
  invoiceLink: string
) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const date = getNormalDate(data.invoice.date as Date);
    const title = `Payment Invoice for the ${data.invoice.title} Made on ${date}`;
    await resend.emails.send({
      from: "Udvc PMS <onboarding@resend.dev>",
      to: data.client.email,
      subject: `Invoice for ${data.user.name} - ${data.client.name}`,
      react: InvoiceLink({
        invoiceLink: invoiceLink,
        preview: title,
        title: title,
        username: data.user?.name || "",
      }),
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
