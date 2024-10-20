import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader, Plus, PlusCircle } from "lucide-react";
import React from "react";
type SubmitButtonProps = {
  title: string;
  loadingTitle?: string;
  className?: string;
  loaderIcon?: any;
  buttonIcon?: any;
  loading: boolean;
  showIcon?: boolean;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
};
export default function SubmitButton({
  title,
  loadingTitle = "กำลังดำเนินการ...",
  loading,
  className,
  loaderIcon = Loader,
  buttonIcon = PlusCircle,
  showIcon = true,
}: SubmitButtonProps) {
  const LoaderIcon = loaderIcon;
  const ButtonIcon = buttonIcon;
  return (
    <>
      {loading ? (
        <Button
          type="button"
          size={"sm"}
          disabled
          className={cn("", className)}
        >
          <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
          {loadingTitle}
        </Button>
      ) : (
        <Button type="submit" className={cn("gap-1", className)}>
          {showIcon && <ButtonIcon className="w-4 h-4" />}
          {title}
        </Button>
      )}
    </>
  );
}
