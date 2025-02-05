import { cn } from "@/lib/utils";
import { CheckCircle, X } from "lucide-react";
import React from "react";

type FeatureCardProps = {
  title: string;
  features: string[];
  isPros: boolean;
  className?: string;
};
export default function FeaturesCard({
  title,
  features,
  isPros,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border p-4 sm:p-12 space-y-3",
        isPros
          ? "bg-black/18 border-black/55 text-black dark:bg-white/10 dark:border-white/55 dark:text-white"
          : "bg-black/10 border-black/55 text-black dark:bg-white/18 dark:border-white/55 dark:text-white",
        className
      )}
    >
      <h2 className="font-bold pb-3 sm:text-left text-xl">{title}</h2>
      {features.map((item, i) => {
        return (
          <div key={i} className="flex items-center justify-start text-left">
            {isPros ? (
              <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 text-green-500 dark:text-green-400" />
            ) : (
              <X className="w-4 h-4 mr-2 flex-shrink-0 text-red-500 dark:text-red-400" />
            )}
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
}
