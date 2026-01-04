import { Transaction } from "@/types/response";
import { ColumnDef } from "@tanstack/react-table";



export const expenseColumn: ColumnDef<Transaction>[] = [

  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {

    header: "Debit",
    cell: ({ row }) => row.original.debitAmount ? `₹ ${row.original.debitAmount.toLocaleString()}` : ""
  },
  {

    header: "Credit",
    cell: ({ row }) => row.original.creditAmount ? `₹ ${row.original.creditAmount.toLocaleString()}` : ""
  },
  {
    header: "Balance",
    cell: ({ row }) => `₹ ${row.original.runningBalance.toLocaleString()}`
  }
];

