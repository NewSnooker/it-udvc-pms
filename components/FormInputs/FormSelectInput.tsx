"use client";

import AddNewButton from "@/components/FormInputs/AddNewButton";
import React, { useState } from "react";
import Select from "react-tailwindcss-select";
import { Option, Options } from "react-tailwindcss-select/dist/components/type";

type FormSelectInputProps = {
  options: Options;
  label: string;
  option: Option;
  setOption: any;
  href?: string;
  labelShown?: boolean;
  toolTipText?: string;
};

export default function FormSelectInput({
  options,
  label,
  option,
  setOption,
  href,
  toolTipText,
  labelShown = true,
}: FormSelectInputProps) {
  return (
    <div className="dark:text-white">
      {labelShown && (
        <h2 className="pb-2 block text-sm font-medium leading-6 dark:text-zinc-300">
          เลือก{label}
        </h2>
      )}
      <div className="flex items-center space-x-2">
        <Select
          isSearchable
          primaryColor="zinc"
          value={option}
          onChange={(item) => setOption(item)}
          options={options}
          placeholder={label}
          classNames={{
            menuButton: (value?: { isDisabled?: boolean }) =>
              `flex  text-sm dark:text-zinc-300 border dark:border-zinc-800 rounded shadow-sm transition-all duration-100 focus:outline-none ${
                value?.isDisabled
                  ? "dark:bg-zinc-800"
                  : "dark:bg-zinc-950 dark:hover:bg-zinc-800 "
              }`,
            menu: "absolute z-10 w-full bg-zinc-50 dark:bg-zinc-950 shadow-lg border dark:border-zinc-700 rounded py-2 mt-1.5 text-sm dark:text-zinc-200",
            searchBox:
              "w-full py-2 px-8 rounded border dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder-zinc-500 focus:ring-zinc-600 focus:border-zinc-100",
            listItem: (value?: { isSelected?: boolean }) =>
              `block transition duration-100 px-2 py-2 cursor-pointer select-none truncate rounded ${
                value?.isSelected
                  ? `bg-zinc-700 text-white dark:bg-zinc-600`
                  : `dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-400`
              }`,
            tagItem: (value?: { isDisabled?: boolean }) =>
              `dark:bg-zinc-600 dark:text-white text-sm rounded-full px-2 py-0.5 m-0.5 ${
                value?.isDisabled ? "opacity-50" : ""
              }`,
            tagItemText: "overflow-ellipsis overflow-hidden whitespace-nowrap",
            tagItemIconContainer:
              "flex items-center justify-center dark:bg-zinc-700 dark:hover:bg-zinc-800 rounded-full w-5 h-5",
            tagItemIcon: "dark:text-white w-3 h-3",
          }}
        />
        {href && toolTipText && (
          <AddNewButton toolTipText={toolTipText} href={href} />
        )}
      </div>
    </div>
  );
}
