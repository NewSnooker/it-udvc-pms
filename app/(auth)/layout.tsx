import Footer from "@/components/frontend/site-footer";
import SiteHeader from "@/components/frontend/site-header";
import { WEBSITE_NAME } from "@/constants";
import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: {
    template: `%s | ${WEBSITE_NAME}`,
    default: `${WEBSITE_NAME}`,
  },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  const session = null;
  const email = process.env.NODEMAILER_USER;

  return (
    <div className="">
      <SiteHeader session={session} />

      <div className="relative isolate px-2 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-8rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        {children}
        <Footer email={email as string} />
      </div>
    </div>
  );
}
