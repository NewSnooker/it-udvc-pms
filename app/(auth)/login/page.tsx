import LoginForm from "@/components/Forms/LoginForm";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
export const metadata = {
  title: "เข้าสู่ระบบ",
};
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { returnUrl = "/dashboard" } = searchParams;
  const session = await getServerSession(authOptions);
  if (session) {
    redirect(returnUrl as string);
  }
  return (
    <section>
      <div className="md:container px-4 md:px-0">
        <div className="max-w-md mx-auto border my-3 sm:mt-16 sm:mb-32 shadow rounded-md">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
