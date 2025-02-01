import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function SendEmailPrefetch({
  email,
  role,
}: {
  email: string;
  role: string;
}) {
  return (
    <Link href={`/dashboard/emails?mail=${email}&role=${role}`} prefetch={true}>
      <Button size="sm">
        <Send className="h-4 w-4" />
      </Button>
    </Link>
  );
}
