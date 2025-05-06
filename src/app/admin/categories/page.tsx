"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Download,
  Edit,
  Delete,
  Trash,
  Trash2,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { TCategory } from "@/models/Category";
import { getAllCategories } from "@/actions/category-action";
import { exportToExcel } from "@/utils/exportHelpers";
import { getCurrentDateTime } from "@/utils/datetime";
import { toast } from "sonner";

export interface Categories {
  name: string;
  description: string;
  slug: string;
}

const columns: ColumnDef<Categories>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Нэр
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-right">Тайлбар</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue("description")}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: () => <div className="text-right">Зам (slug)</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">{row.getValue("slug")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Үйлдэл</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(category.name)}
            >
              Нэр хуулах
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit /> Засах
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="text-red-400 " />
              <span className="text-red-400  ">Устгах</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DataTableDemo() {
  const [categories, setCategories] = useState<TCategory[] | null>([]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: categories ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleExportXLS = () => {
 
    if (table.getFilteredSelectedRowModel().rows.length === 0) {
      toast.warning("Сонголт хийгээгүй байна");
      return;
    }
    
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    exportToExcel(
      selectedRows.map((row) => row.original),
      [
        { header: "name", accessor: "name" },
        { header: "description", accessor: "description" },
        { header: "slug", accessor: "slug" },
      ],
      {
        data: selectedRows.map((row) => row.original),
        columns: [
          { header: "name", accessor: "name" },
          { header: "description", accessor: "description" },
          { header: "slug", accessor: "slug" },
        ],
        filename: "categories" + getCurrentDateTime(),
        sheetName: "Categories",
      }
    );
  };

  const handleExportPDF = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : categories ?? [];

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Та popup зөвшөөрнө үү");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Ангилал жагсаалт</title>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              padding: 8px; 
              text-align: left; 
              border: 1px solid #ddd; 
            }
            th { 
              background-color: #f2f2f2; 
            }
            h1 { 
              text-align: center; 
            }
            .print-footer { 
              text-align: center; 
              margin-top: 30px; 
              font-size: 12px; 
            }
            @media print {
              .no-print { 
                display: none; 
              }
              button { 
                display: none; 
              }
            }
          </style>
        </head>
        <body>
          <h1>Ангилал жагсаалт</h1>
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
              PDF хадгалах
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Нэр</th>
                <th>Тайлбар</th>
                <th>Зам (slug)</th>
              </tr>
            </thead>
            <tbody>
              ${dataToExport
                .map(
                  (item: any) => `
                <tr>
                  <td>${item.name || ""}</td>
                  <td>${item.description || ""}</td>
                  <td>${item.slug || ""}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="print-footer">
            Хэвлэсэн огноо: ${new Date().toLocaleString("mn-MN")}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getAllCategories();
      if (Array.isArray(result)) {
        setCategories(result as TCategory[]);
      } else {
        console.error("Invalid data format for brands:", result);
        setCategories(null);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ангилал удирдлага</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Нэрээр хайлт хийх..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex space-x-2 ml-4">
          <Button
            variant="outline"
            onClick={handleExportXLS}
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            EXCEL
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Багана <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                  Илэрц олдсонгүй.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Сонгосон {table.getFilteredSelectedRowModel().rows.length}
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium"></p>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Өмнөх
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Дараах
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
