import ResetPasswordForm from "@/components/ResetPasswordForm";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export const metadata = {
  title: "รีเซ็ตรหัสผ่าน",
  description: "รีเซ็ตรหัสผ่าน",
};

export default async function page({ params }: { params: { userId: string } }) {
  if (!params.userId) {
    return notFound();
  }
  const session = await getServerSession(authOptions);

  return (
    <div className=" sm:max-w-6xl mx-auto">
      <ResetPasswordForm userId={params.userId} session={session} />
    </div>
  );
}
