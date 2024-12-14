import React from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

export default function PaymentDeleteButton({
  paymentId,
}: {
  paymentId: string;
}) {
  return (
    <Button variant="outline" size={"sm"}>
      <Trash className="h-4 w-4" />{" "}
    </Button>
  );
}
