"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import SearchBar from "./SearchBar";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "../ui/button";
import { ListFilter } from "lucide-react";
import DateFilters from "./DateFilters";
import DateRangeFilter from "./DateRangeFilter";
import { DataTablePagination } from "./DataTablePagination";
import ProjectSummary from "../DataTableColumns/ProjectSummary";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  model?: string | undefined | null;
}
export default function DataTable<TData, TValue>({
  columns,
  data,
  model = null,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [searchResults, setSearchResults] = useState(data);
  const [filteredData, setFilteredData] = useState(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isSearch, setIsSearch] = useState(true);
  // console.log(isSearch);
  const table = useReactTable({
    data: isSearch ? searchResults : filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  // console.log(searchResults);
  // const finalData = isSearch ? searchResults : filteredData;
  return (
    <div className="w-full space-y-4">
      {model && model === "project" ? (
        <ProjectSummary data={isSearch ? searchResults : filteredData} />
      ) : null}

      {/* ปรับ layout ของ filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center w-full">
        <div className="w-full sm:max-w-sm">
          <SearchBar
            data={data}
            onSearch={setSearchResults}
            setIsSearch={setIsSearch}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:ml-auto">
          <DateRangeFilter
            data={data}
            onFilter={setFilteredData}
            setIsSearch={setIsSearch}
          />
          <DateFilters
            data={data}
            onFilter={setFilteredData}
            setIsSearch={setIsSearch}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block whitespace-nowrap">
                  การกรอง
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>การกรอง</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* ปรับ table container */}
      <div className="relative w-full">
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
