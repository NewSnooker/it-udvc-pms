"use server";
import { getNormalDate } from "@/lib/getNormalDate";
import { ExistingUsers, InvoiceDetails } from "@/types/types";
import { render } from "@react-email/render";
import { InvoiceLink } from "@/components/email-templates/InvoiceLink";
import nodemailer from "nodemailer";
import ClientInvitation, {
  ClientInvitationProps,
} from "@/components/email-templates/ClientInvitation";
import React from "react";
import { WEBSITE_NAME } from "@/constants";
import MemberInvitation, {
  InvitationDetailsProps,
} from "@/components/email-templates/MemberInvitation";
import { db } from "@/prisma/db";

export async function sendInvoiceLink(
  data: InvoiceDetails,
  invoiceLink: string
) {
  try {
    const date = getNormalDate(data.invoice.date as Date);
    const title = `ใบแจ้งหนี้ ${data.invoice.title} วันที่ ${date}`;
    const preview = `ใบแจ้งหนี้ ${data.invoice.title} วันที่ ${date}`;
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
      subject: `ใบแจ้งหนี้ ${username} - ${clientMail}`,
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
        loginEmail: data.loginEmail,
        loginPassword: data.loginPassword,
        loginLink: data.loginLink,
      })
    );

    const options = {
      from: `${WEBSITE_NAME} <${process.env.NODEMAILER_USER}>`,
      to: data.loginEmail,
      subject: `เชิญชวนร่วมมือในโครงการ ${data.projectName} `,
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
export async function sendMemberInvitation({
  members,
  projectData,
}: {
  members: ExistingUsers[];
  projectData: InvitationDetailsProps;
}) {
  try {
    const mails = members.map((user) => user.email);
    const promises = members.map((member) => {
      return db.guestProject.create({
        data: {
          projectLink: projectData.loginLink,
          projectName: projectData.projectName,
          guestName: member.name,
          projectOwner: projectData.projectOwner,
          guestId: member.id,
          projectOwnerId: projectData.projectOwnerId,
        },
      });
    });

    await Promise.all(promises);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const emailHtml = await render(
      React.createElement(MemberInvitation, {
        memberName: projectData.memberName,
        projectName: projectData.projectName,
        projectOwner: projectData.projectOwner,
        loginLink: projectData.loginLink,
      })
    );

    const options = {
      from: `${WEBSITE_NAME} <${process.env.NODEMAILER_USER}>`,
      to: mails,
      subject: `เชิญชวนร่วมมือในโครงการ ${projectData.projectName} `,
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
