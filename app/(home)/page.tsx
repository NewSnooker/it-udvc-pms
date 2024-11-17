import ComparisonFeatures from "@/components/ComparisonFeatures";
import Announcement from "@/components/frontend/announcement";
import { Testimonials } from "@/components/frontend/testimonials";
import { AnimatedAvatars } from "@/components/global/avatar-circles";
import { CustomLinkButton } from "@/components/global/CustomLinkButton";
import Iframe from "react-iframe";
import StarRating from "@/components/global/StarRating";
import HowItWorks from "@/components/HowItWorks";
import { BorderBeam } from "@/components/magicui/border-beam";
import { ModeToggle } from "@/components/mode-toggle";
import { Star } from "lucide-react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import SectionHeading from "@/components/global/SectionHeading";
import Pricing from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { useSession } from "next-auth/react";
import { CustomerReviews } from "@/components/frontend/CustomerReviews";
import Showcase from "@/components/frontend/showcase";
import { getKitUsers } from "@/actions/users";
import { WEBSITE_NAME } from "@/constants";
export default async function Home() {
  const count = (await getKitUsers()) ?? 0;
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl py-16 ">
        {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <Announcement title="Introducing Component Pages" href="/pages" />
        </div> */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            จัดการโครงการของคุณให้มีประสิทธิภาพยิ่งขึ้น
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 mb-4">
            ระบบ {WEBSITE_NAME} สำหรับผู้จัดการโครงการที่ช่วยให้คุณติดตามงาน
            จัดการทีม และสร้างผลลัพธ์ที่ยอดเยี่ยม
          </p>
          <CustomLinkButton title="เริ่มใช้งานฟรี" href="/dashboard" />
          <div className="pt-8 pb-4 flex items-center  justify-center gap-8">
            <div className="">
              <AnimatedAvatars />
            </div>
            <div className="">
              <StarRating count={5} />
              <p className="dark:text-zinc-900">{count} developers use it.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl py-16">
        <div className="">
          <ComparisonFeatures />
        </div>
        {/* <div className="py-16">
          <div className="relative rounded-lg overflow-hidden">
            <BorderBeam />
            <Image
              src="/dashboard.png"
              alt="This is the dashbaord Image"
              width={1775}
              height={1109}
              className="w-full h-full rounded-lg object-cover  border"
            />
          </div>
        </div> */}
        {/* <div className="py-16">
          <CustomerReviews />
        </div> */}

        <div className="py-16">
          <HowItWorks />
          <div className="pb-8">
            <Testimonials />
          </div>
        </div>

        {/* <div className="py-16 relative">
          <Iframe
            url="https://www.youtube.com/embed/Kxea70yK11I?si=ba72X9z64cEgaCp1"
            width="100%"
            id=""
            className="h-[30rem] rounded-sm"
            display="block"
            position="relative"
          />

        </div> */}
      </div>
      {/* <div className="pb-16">
        <Showcase />
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="mx-auto max-w-4xl py-16 ">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <Announcement
              title="Introducing email templates"
              href="/email-templates"
            />
          </div>
          <div className="text-center text-balance">
            <SectionHeading title="Stop wasting hours managing Stripe invoices" />
            <p className="mt-6 text-lg leading-8 text-zinc-600 mb-4">
              Ditch the Stripe Invoicing fee, reduce customer support, and focus
              on your startup. 1-minute no-code setup.
            </p>
          </div>
        </div>
        <div className="py-8">
          <Pricing />
          <div className="pb-8">
            <Testimonials />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="py-8">
          <FAQ />
        </div>
      </div>
      <div className="mx-auto max-w-4xl py-16 ">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            Ditch Stripe Invoicing fee and focus on your startup
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 mb-4">
            Let your customers generate, edit, and download invoices themselves.
          </p>
          <CustomLinkButton title="Get Started" href="/courses/next/#pricing" />
          <div className="pt-8 pb-4 flex items-center  justify-center gap-8">
            <div className="">
              <AnimatedAvatars />
            </div>
            <div className="">
              <StarRating count={5} />
              <p>785 founders sleep better</p>
            </div>
          </div>
          <div className="pb-8">
            <Testimonials />
          </div>
        </div>
      </div> */}
    </main>
  );
}
