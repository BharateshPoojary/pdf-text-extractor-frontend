import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalItems?: number;
  showPageSizeSelector?: boolean;
}

export function TablePagination<TData>({
  table,
  totalItems,
  showPageSizeSelector = false,
}: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, totalItems ?? 0);

  // Calculate visible page numbers
  const getVisiblePageNumbers = () => {
    const visiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const end = Math.min(totalPages, start + visiblePages - 1);

    if (end === totalPages) {
      start = Math.max(1, end - visiblePages + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return { pages, start, end };
  };

  const {
    pages: pageNumbers,
    start: startPage,
    end: endPage,
  } = getVisiblePageNumbers();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    table.setPageIndex(page - 1);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between p-4">
      <div className="flex items-center max-sm:justify-between gap-2 w-full">
        {totalItems !== undefined && (
          <div className="text-sm text-gray-600">
            Showing {startRow} to {endRow} of{" "}
            {table.getFilteredRowModel().rows.length} results
          </div>
        )}

        {showPageSizeSelector && (
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center max-sm:justify-between max-sm:w-full gap-x-2">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center gap-1 mr-2"
        >
          <ArrowLeft className="h-4 w-4" />

          <span className="max-sm:hidden">Previous</span>
        </Button>

        <div className="hidden md:flex">
          {startPage > 1 && (
            <>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(1)}
                className={`h-9 w-9 p-0 mr-2 ${
                  currentPage === 1
                    ? "bg-[#F9F5FF] text-[#6941C6] hover:bg-[#6941C6]/20"
                    : ""
                }`}
              >
                1
              </Button>
              {startPage > 2 && <span className="mx-1 text-gray-500">...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(number)}
              className={`h-9 w-9 p-0 mr-2 ${
                currentPage === number
                  ? "bg-[#F9F5FF] text-[#6941C6] hover:bg-[#6941C6]/20"
                  : ""
              }`}
            >
              {number}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="mx-1 text-gray-500">...</span>
              )}
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                className={`h-9 w-9 p-0 mr-2 ${
                  currentPage === totalPages
                    ? "bg-[#F9F5FF] text-[#6941C6] hover:bg-[#6941C6]/20"
                    : ""
                }`}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden text-sm flex items-center mx-2">
          <span className="text-gray-600 mr-1">
            Page {currentPage} of {totalPages}
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
        </div>

        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center gap-1"
        >
          <span className="max-sm:hidden">Next</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
