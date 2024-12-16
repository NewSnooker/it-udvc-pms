import { getPortfolioByUserId } from "@/actions/portfolio";
import PortfolioForm from "@/components/Forms/PortfolioForm";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/config/auth";
import { getAuthUser } from "@/config/getAuthUser";
import { generateSlug } from "@/lib/generateSlug";
import { getServerSession, Session } from "next-auth";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Portfolio",
  description: "Customize Your Portfolio",
};
export default async function page() {
  const session: Session | null = await getServerSession(authOptions);
  const user = await getAuthUser();
  const slug = generateSlug(user?.name ?? "");
  const initialData = await getPortfolioByUserId(user?.id ?? "");
  return (
    <div className="p-8">
      <div className="flex border-b items-center justify-between pb-3">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Customize Your Portfolio
        </h2>
        <div className="flex gap-4">
          <Link target="_blank" href={`/portfolio/${slug}?id=${user?.id}`}>
            <Button>Preview</Button>
          </Link>
          <Button>Copy</Button>
        </div>
      </div>
      <div className="pb-6">
        <PortfolioForm
          initialData={initialData}
          editingId={initialData?.id}
          session={session}
        />
      </div>
    </div>
  );
}
