import { getPortfolioByUserId } from "@/actions/portfolio";
import { ShareLink } from "@/components/dashboard/ShareLink";
import PortfolioForm from "@/components/Forms/PortfolioForm";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/config/auth";
import { getAuthUser } from "@/config/getAuthUser";
import { Eye } from "lucide-react";
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
  const initialData = await getPortfolioByUserId(user?.id ?? "");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row border-b items-center justify-between pb-3">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-center">
          {initialData?.id
            ? "Customize Your Portfolio"
            : "Generate Your Portfolio"}
        </h2>
        {initialData?.id && (
          <div className="flex gap-4 mt-2 sm:mt-0 ">
            <Link target="_blank" href={`/portfolio/${user?.id}`}>
              <Button className="">
                <Eye className="mr-1 sm:mr-2 h-4 w-4" /> Preview
              </Button>
            </Link>
            <ShareLink link={`${baseUrl}/portfolio/${user?.id}`} />
          </div>
        )}
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
