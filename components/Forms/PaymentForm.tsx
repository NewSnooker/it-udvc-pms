import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
export default function PaymentForm() {
  return (
    <Dialog>
      <DialogTrigger>
        {" "}
        <div className="py-1 w-full">
          <Button variant="outline" size={"sm"} className="w-full">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            เพิ่มการชำระเงิน
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
