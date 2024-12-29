import { WEBSITE_NAME } from "@/constants";
import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: {
    template: `%s | ${WEBSITE_NAME}`,
    default: `${WEBSITE_NAME}`,
  },
};
export default async function ProjectLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="">{children}</div>;
}
