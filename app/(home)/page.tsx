import ComparisonFeatures from "@/components/ComparisonFeatures";
import { AnimatedAvatars } from "@/components/global/avatar-circles";
import { CustomLinkButton } from "@/components/global/CustomLinkButton";
import StarRating from "@/components/global/StarRating";
import { getUsersKit } from "@/actions/users";
import { WEBSITE_NAME } from "@/constants";
import { BorderBeam } from "@/components/magicui/border-beam";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
export default async function Home() {
  const usersKit = await getUsersKit();
  const users = usersKit?.users || [];
  const count = usersKit?.count || 0;
  const session = await getServerSession(authOptions);
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl py-5 sm:py-36 ">
        <div className=" text-center ">
          <h1 className="hidden sm:block text-4xl font-bold tracking-tight sm:text-6xl pb-6 leading-normal">
            จัดการโครงการ{" "}
            <span className="text-pink-600 dark:text-pink-500">ของคุณ</span>
            <br />
            ให้มีประสิทธิภาพยิ่งขึ้น
          </h1>
          <h1 className="sm:hidden text-4xl font-bold tracking-tight sm:text-6xl pb-6 leading-normal">
            จัดการโครงการ
            <br />
            <span className="text-pink-600 dark:text-pink-500">ของคุณ</span>
            <br />
            ให้มีประสิทธิภาพ
            <br />
            ยิ่งขึ้น
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground pb-6">
            ระบบ {WEBSITE_NAME} สำหรับผู้จัดการโครงการที่ช่วยให้คุณติดตามงาน
            จัดการทีม และสร้างผลลัพธ์ที่ยอดเยี่ยม
          </p>
          {session ? (
            <CustomLinkButton title="แดชบอร์ด" href="/dashboard" />
          ) : (
            <CustomLinkButton title="เริ่มใช้งานฟรี" href="/login" />
          )}
          {count > 0 && (
            <div className="pt-8 pb-4 flex items-center justify-center ">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-8">
                <AnimatedAvatars
                  users={users.filter(
                    (
                      user
                    ): user is { id: string; name: string; image: string } =>
                      user.image !== null
                  )}
                />
                <div className="flex flex-col items-center gap-2">
                  <StarRating count={5} />
                  <div className="">มีผู้ใช้ {count} คน </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className="mx-auto max-w-6xl py-8 sm:py-16 scroll-mt-10 sm:scroll-mt-20"
        id="เกี่ยวกับ"
      >
        <div className="">
          <ComparisonFeatures />
        </div>
        <div>
          <div className="relative rounded-lg overflow-hidden">
            <BorderBeam />
            <Image
              src="/dashboard.png"
              alt="This is the dashboard Image"
              width={1775}
              height={1109}
              className="w-full h-full rounded-lg object-cover  border"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
