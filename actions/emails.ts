"use server";
import { getNormalDate } from "@/lib/getNormalDate";
import { InvoiceDetails, InvoiceLinkProps } from "@/types/types";
import { render } from "@react-email/render";
import { InvoiceLink } from "@/components/email-templates/InvoiceLink";
import nodemailer from "nodemailer";
import ClientInvitation, {
  ClientInvitationProps,
} from "@/components/email-templates/ClientInvitation";
import React from "react";
import { WEBSITE_NAME } from "@/constants";

export async function sendInvoiceLink(
  data: InvoiceDetails,
  invoiceLink: string
) {
  try {
    const date = getNormalDate(data.invoice.date as Date);
    const title = `Payment Invoice for the ${data.invoice.title} Made on ${date}`;
    const preview = `Payment Invoice for the ${data.invoice.title} Made on ${date}`;
    const username = data.user?.name || "";
    const clientMail = data.client?.email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const emailHtml = await render(
      React.createElement(InvoiceLink, {
        invoiceLink,
        preview,
        title,
        username,
      })
    );

    const options = {
      from: `${WEBSITE_NAME} <${process.env.NODEMAILER_USER}>`,
      to: clientMail,
      subject: `Invoice for ${username} - ${clientMail}`,
      html: emailHtml,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
          console.log(info);
        }
      });
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
export async function sendClientInvitation(data: ClientInvitationProps) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const emailHtml = await render(
      React.createElement(ClientInvitation, {
        clientName: data.clientName,
        projectName: data.projectName,
        message: data.message,
        loginEmail: data.loginEmail,
        loginPassword: data.loginPassword,
        loginLink: data.loginLink,
      })
    );

    const options = {
      from: `${WEBSITE_NAME} <${process.env.NODEMAILER_USER}>`,
      to: data.loginEmail,
      subject: `Invitation to collaborate on ${data.projectName} `,
      html: emailHtml,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
          console.log(info);
        }
      });
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
