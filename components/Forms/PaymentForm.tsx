"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PaymentProps } from "@/types/types";
import TextInput from "../FormInputs/TextInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Banknote,
  CreditCard,
  HandCoins,
  HandIcon,
  LoaderIcon,
  PlusCircle,
} from "lucide-react";
import { createPayment } from "@/actions/payment";
import { generateInvoiceNumber } from "@/lib/generateInvoiceNumber";
import { convertIsoDateToNormal } from "@/lib/convertIsoDateToNormal";
import SubmitButton from "../FormInputs/SubmitButton";
import { DialogDescription } from "@radix-ui/react-dialog";
import { convertDateToIso } from "@/lib/convertDateToIso";

export default function PaymentForm({
  projectId,
  userId,
  clientId,
  remainingAmount,
}: {
  projectId: string;
  userId: string;
  clientId: string;
  remainingAmount: number;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentProps>({
    defaultValues: {
      date: convertIsoDateToNormal(new Date().toISOString()),
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function savePayment(data: PaymentProps) {
    data.invoiceNumber = generateInvoiceNumber();
    data.userId = userId;
    data.clientId = clientId;
    data.projectId = projectId;
    const subTotal = Number(data.amount);
    data.tax = Number(data.tax);
    data.amount = subTotal + data.tax;
    data.date = convertDateToIso(data.date as string);

    try {
      setLoading(true);
      await createPayment(data);
      setLoading(false);
      toast.success("สร้างการชำระเงินสําเร็จ");
      reset();
      setOpen(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <PlusCircle className="w-4 h-4 mr-1.5" />
          เพิ่มการชำระเงิน
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มการชำระเงิน</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span className="flex items-center ">
            {remainingAmount < 0 ? (
              <div className="">
                <span>จำนวนงบประมาน เกินงบประมาน:</span>
                <span className="ml-2 font-bold text-red-500">
                  {Math.abs(remainingAmount).toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="">
                <span>จำนวนงบประมาน คงเหลือ:</span>
                <span className="ml-2 font-bold text-yellow-500">
                  {remainingAmount.toLocaleString()}
                </span>
              </div>
            )}
            <span className="ml-2">บาท</span>
          </span>
        </DialogDescription>
        <form onSubmit={handleSubmit(savePayment)}>
          <div className="grid gap-2">
            <Card className="py-2 border-none">
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <TextInput
                      register={register}
                      errors={errors}
                      label="ชื่อการชำระเงิน"
                      placeholder="กรอกชื่อการชำระเงิน"
                      name="title"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        register={register}
                        errors={errors}
                        label="จำนวนการชำระเงิน"
                        type="number"
                        placeholder="0"
                        unit="บาท"
                        name="amount"
                        icon={Banknote}
                      />
                      <TextInput
                        register={register}
                        errors={errors}
                        label="วันที่ชำระเงิน"
                        type="date"
                        name="date"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextInput
                        register={register}
                        errors={errors}
                        label="ภาษี"
                        type="number"
                        placeholder="0"
                        unit="บาท"
                        icon={HandCoins}
                        name="tax"
                      />
                      <TextInput
                        register={register}
                        errors={errors}
                        label="ช่องทางการชำระเงิน"
                        name="method"
                        icon={CreditCard}
                        placeholder="กรอกช่องทางการชำระเงิน"
                      />
                    </div>
                    <SubmitButton
                      title="เพิ่มการชำระเงิน"
                      loading={loading}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
