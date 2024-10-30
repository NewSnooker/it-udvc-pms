"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
const getGradientClass = (value: number) => {
  if (value === 100) {
    return "from-green-200 via-green-500 to-green-600"; // สีเมื่อถึง 100%
  } else if (value >= 20) {
    return "from-yellow-200 via-yellow-400 to-yellow-600"; // สีเมื่ออยู่ในช่วง 50%-99%
  } else {
    return "from-red-300 via-red-400 to-red-600"; // สีเมื่ออยู่ในช่วง 0%-49%
  }
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full shadow-inner bg-zinc-200 dark:bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1 bg-gradient-to-r  ${getGradientClass(
        value ?? 0
      )}  transition-all`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
