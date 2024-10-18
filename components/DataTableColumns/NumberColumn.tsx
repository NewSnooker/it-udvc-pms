import React from "react";

export default function NumberColumn({
  row,
  accessorKey,
}: {
  row: any;
  accessorKey: string;
}) {
  const number = row.getValue(`${accessorKey}`);
  return (
    <div className=" w-full flex">
      <div className="">{number.toLocaleString()}</div>
    </div>
  );
}
