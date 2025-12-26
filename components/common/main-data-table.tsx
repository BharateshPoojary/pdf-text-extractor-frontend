"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  ColumnFiltersState,
  VisibilityState,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { inter } from "@/styles/fonts";
import { TableContent } from "@/components/common/table-content";
import { TablePagination } from "@/components/common/table-pagination";
import { TableColumnVisibility } from "@/components/common/table-column-visibility";
interface MainDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  title: string;
  desc?: string;
  loading?: boolean;
  error?: Error | null;
  filters?: (table: ReturnType<typeof useReactTable<TData>>) => React.ReactNode;
  onSelectedIdsChange?: (ids: string[]) => void;
  onSelectedRowsChange?: (rows: TData[]) => void;
  getRowId?: (row: TData) => string;
  selectColumnVisibilityFilter?: boolean;
  initialPageSize?: number;
}

export default function MainDataTable<TData, TValue>({
  columns,
  data,
  title,
  desc,
  loading,
  error = null,
  filters,
  onSelectedIdsChange,
  onSelectedRowsChange,
  getRowId,
  selectColumnVisibilityFilter = false,
  initialPageSize = 10,
}: MainDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);

      if (!data) return;
      // derive the selected rows
      const selectedRows = Object.keys(newSelection)
        .map((key) => data[parseInt(key)])
        .filter(Boolean);
      // derive the IDs exactly like before
      const selectedIds = selectedRows.map((row) =>
        getRowId ? getRowId(row) : (row as unknown as { id: string }).id
      );
      // fire your existing id callback
      if (onSelectedIdsChange) {
        onSelectedIdsChange(selectedIds);
      }
      // fire the new rows callback
      if (onSelectedRowsChange) {
        onSelectedRowsChange(selectedRows);
      }
    },
    getCoreRowModel: getCoreRowModel<TData>(),
    getPaginationRowModel: getPaginationRowModel<TData>(),
    getFilteredRowModel: getFilteredRowModel<TData>(),
    getSortedRowModel: sorting.length ? getSortedRowModel<TData>() : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    enableSorting: true,
    // manualPagination: true,
  });

  return (
    <div className="border rounded-xl bg-white shadow-sm">
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-2 p-3 sm:p-5">
        <div>
          <div
            className={`flex items-center space-x-2 ${inter.className} font-medium`}
          >
            <h3 className="text-lg font-semibold">{title}</h3>

            <p className="text-[#6941C6] text-xs bg-[#F9F5FF] px-2 py-1 rounded-2xl">
              {data?.length} Entries
            </p>
          </div>
          {desc && (
            <div className={`text-sm text-gray-500 mb-2 ${inter.className}`}>
              {desc}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {selectColumnVisibilityFilter && (
            <TableColumnVisibility table={table} />
          )}

          {filters?.(table)}
        </div>
      </div>
      <TableContent
        table={table}
        columnsLength={columns.length}
        isLoading={loading}
        error={error}
      />
      {table.getFilteredRowModel().rows.length > 0 && (
        <TablePagination
          table={table}
          totalItems={data?.length}
          showPageSizeSelector={true}
        />
      )}
    </div>
  );
}
