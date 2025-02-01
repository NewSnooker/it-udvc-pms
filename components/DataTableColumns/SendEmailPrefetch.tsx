import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function SendEmailPrefetch({
  email,
  role,
}: {
  email: string;
  role: string;
}) {
  const router = useRouter();
  const href = `/dashboard/emails?mail=${email}&role=${role}`;

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  return (
    <Link href={href}>
      <Button size="sm">
        <Send className="h-4 w-4" />
      </Button>
    </Link>
  );
}
