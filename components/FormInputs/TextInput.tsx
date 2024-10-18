import { cn } from "@/lib/utils";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CircleHelp, Mail } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
type TextInputProps = {
  register: any;
  errors: any;
  label: string;
  type?: string;
  name: string;
  toolTipText?: string;
  unit?: string;
  placeholder?: string;
  icon?: any;
};
export default function TextInput({
  register,
  errors,
  label,
  type = "text",
  name,
  toolTipText,
  unit,
  icon,
  placeholder,
}: TextInputProps) {
  const Icon = icon;
  return (
    <div>
      <div className="flex space-x-2 items-center">
        <Label htmlFor={name} className="block text-sm font-medium leading-6 ">
          {label}
        </Label>
        {toolTipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <CircleHelp className="w-4 h-4 text-zinc-500" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{toolTipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="mt-2">
        <div className="relative rounded-md ">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className=" w-4 h-4" />
            </div>
          )}
          <Input
            id={name}
            type={type}
            {...register(`${name}`, { required: true })}
            className={cn(
              "",
              (errors[`${name}`] && "focus:ring-red-500 pl-8") ||
                (icon && "pl-8")
            )}
            placeholder={placeholder || label}
          />
          {unit && (
            <p className=" py-2 px-3 rounded-tr-md rounded-br-md absolute inset-y-0 right-1 my-[2px] flex items-center">
              {unit}
            </p>
          )}
        </div>
        {errors[`${name}`] && (
          <span className="text-xs text-red-600">จำเป็นต้องกรอก {label}</span>
        )}
      </div>
    </div>
  );
}
