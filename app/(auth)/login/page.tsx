import LoginForm from "@/components/Forms/LoginForm";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

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
        <div className="border-gray-200 dark:border-gray-700 max-w-md mx-auto border my-3 shadow rounded-md ">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
