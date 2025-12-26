import { Table as ReactTable, flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { inter } from "@/styles/fonts";

interface TableContentProps<TData> {
  table: ReactTable<TData>;
  columnsLength: number;
  isLoading?: boolean;
  error?: Error | null;
}

export function TableContent<TData>({
  table,
  columnsLength,
  isLoading,
  error = null,
}: TableContentProps<TData>) {
  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b bg-slate-100">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={`py-3 px-4 text-left font-medium text-gray-700 ${inter.className}`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getCanSort() && (
                          <div className="ml-1">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : (
                              <div className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100"></div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-b">
                {Array.from({ length: columnsLength }).map((_, colIndex) => (
                  <TableCell key={colIndex} className="p-4">
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getPaginationRowModel().rows?.length ? (
            table.getPaginationRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={`p-4 ${inter.className}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsLength} className="h-24 text-center">
                {error ? (
                  <div className="text-red-500 text-center">
                    {error.message}
                  </div>
                ) : (
                  "No results."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
