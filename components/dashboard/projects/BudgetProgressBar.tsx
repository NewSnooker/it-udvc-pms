import React from "react";

interface BudgetProgressBarProps {
  budget?: number;
  paidAmount?: number;
}

export default function BudgetProgressBar({
  budget = 0,
  paidAmount = 0,
}: BudgetProgressBarProps) {
  const safeNumber = (value: number | undefined): number => {
    return typeof value === "number" && !isNaN(value) ? value : 0;
  };

  const safeBudget = safeNumber(budget);
  const safePaidAmount = safeNumber(paidAmount);
  const remainingAmount = Math.max(safeBudget - safePaidAmount, 0);
  const paidPercentage =
    safeBudget === 0 ? 0 : Math.min((safePaidAmount / safeBudget) * 100, 100);
  const isOverBudget = safePaidAmount > safeBudget;
  const overBudgetPercentage = isOverBudget
    ? ((safePaidAmount - safeBudget) / safeBudget) * 100
    : 0;

  const formatNumber = (value: number): string => {
    return value.toLocaleString("th-TH");
  };

  const formatPercentage = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <div className="w-full border-t pt-3">
      <div className="flex justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-zinc-600">
          งบประมาณ
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs sm:text-sm font-medium ${
              isOverBudget ? "text-red-600" : "text-zinc-600"
            }`}
          >
            {`${formatNumber(safePaidAmount)} / ${formatNumber(
              safeBudget
            )} บาท`}
          </span>
        </div>
      </div>
      <div className="relative w-full bg-zinc-200 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOverBudget ? "bg-red-500" : "bg-green-500 dark:bg-green-600"
          }`}
          style={{ width: `${paidPercentage}%` }}
        />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium text-zinc-600 bg-white/80 px-1 rounded ">
          {formatPercentage(paidPercentage)}%
        </span>
      </div>
      <div className="flex justify-between mt-2">
        <span className={`text-xs sm:text-sm text-zinc-600`}>
          ชำระแล้ว {formatNumber(safePaidAmount)} บาท
        </span>
        <span
          className={`text-xs sm:text-sm ${
            isOverBudget ? "text-red-600" : "text-zinc-600"
          }`}
        >
          <div className="">
            <div className="">
              {isOverBudget
                ? `เกินงบประมาณ ${formatNumber(
                    safePaidAmount - safeBudget
                  )} บาท`
                : `คงเหลือ ${formatNumber(remainingAmount)} บาท`}
            </div>
            <div className="">
              {isOverBudget && (
                <span className="inline-flex items-center justify-end mt-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  เกินงบประมาณ {formatPercentage(overBudgetPercentage)}%
                </span>
              )}
            </div>
          </div>
        </span>
      </div>
    </div>
  );
}
