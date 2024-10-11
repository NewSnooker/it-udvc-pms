import { cn } from "@/lib/utils";
import React from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
type TextAreaProps = {
  register: any;
  errors: any;
  label: string;
  name: string;
  helperText?: string;
};
export default function TextArea({
  register,
  errors,
  label,
  name,
  helperText = "",
}: TextAreaProps) {
  return (
    <div className="col-span-full">
      <Label htmlFor={name} className="block text-sm font-medium leading-6">
        {label}
      </Label>
      <div className="mt-2">
        <Textarea
          id={name}
          {...register(`${name}`, { required: true })}
          rows={3}
          className={cn("", errors[`${name}`] && "focus:ring-red-500")}
        />
        {errors[`${name}`] && (
          <span className="text-xs text-red-600">Description is required</span>
        )}
      </div>
      {helperText && (
        <p className="mt-1 text-sm leading-6 text-zinc-600">{helperText}</p>
      )}
    </div>
  );
}
