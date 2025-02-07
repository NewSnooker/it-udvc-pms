import RegisterForm from "@/components/Forms/RegisterForm";
import React from "react";
export const metadata = {
  title: "สมัครสมาชิก",
};
export default function page() {
  return (
    <section>
      <div className="md:container px-4 md:px-0">
        <div className="max-w-xl mx-auto border my-3 sm:mt-16 sm:mb-32 shadow rounded-md">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}
