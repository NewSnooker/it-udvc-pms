import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { Info } from "lucide-react";

export const metadata = {
  title: "ลืมรหัสผ่าน",
  description: "ลืมรหัสผ่าน",
};

export default function page() {
  return (
    <div className="max-w-xl mx-auto px-8  mt-36">
      <div
        id="alert-additional-content-2"
        className="p-4 sm:py-10 mb-4 border rounded-lg bg-card "
        role="alert"
      >
        <div className="flex items-center sm:px-8 ">
          <Info className="flex-shrink-0 w-4 h-4 me-2" />
          <span className="sr-only">Info</span>
          <h3 className="text-lg sm:text-xl font-bold">ลืมรหัสผ่าน</h3>
        </div>

        <div className="sm:px-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
