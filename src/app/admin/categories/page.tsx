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
  Trash,
  FileText,
} from "lucide-react";

import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { TCategory } from "@/models/Category";
import { getAllCategories, deleteCategory } from "@/actions/category-action";
import { exportToExcel, exportToPDF } from "@/utils/exportHelpers";
import { getCurrentDateTime } from "@/utils/datetime";
import { toast } from "sonner";
import { generateColumnDefinitions } from "@/utils/generation";

export interface Categories {
  name: string;
  description: string;
  slug: string;
}
const categoryColumnDefinitions = generateColumnDefinitions<Categories>({
  name: "Нэр",
  description: "Тайлбар",
  slug: "Зам",
});

export default function DataTableDemo() {
  const router = useRouter();
  const [categories, setCategories] = useState<TCategory[] | null>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<TCategory | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
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

        const handleDeleteClick = () => {
          setCategoryToDelete(category as any);
          setDeleteDialogOpen(true);
        };

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
                onClick={() => {
                  navigator.clipboard.writeText(category.name);
                  toast.success("Нэр хуулагдлаа");
                }}
              >
                Нэр хуулах
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/categories/${(category as any)._id}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" /> Засах
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick}>
                <Trash className="text-red-400 " />
                <span className="text-red-400">Устгах</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
    const selectedData = selectedRows.map((row) => row.original);

    const columnTemplate: Categories = { name: "", description: "", slug: "" };
    const exportColumns = categoryColumnDefinitions(columnTemplate);

    exportToExcel(selectedData, exportColumns, {
      data: selectedData,
      columns: exportColumns,
      filename: "categories" + getCurrentDateTime(),
      sheetName: "Categories",
    });
  };

  const handleExportPDF = () => {
    if (table.getFilteredSelectedRowModel().rows.length === 0) {
      toast.warning("Сонголт хийгээгүй байна");
      return;
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedData = selectedRows.map((row) => row.original);

    exportToPDF({
      data: selectedData,
      columns: categoryColumnDefinitions({
        name: "",
        description: "",
        slug: "",
      }),
      title: "Ангилал жагсаалт",
      filename: "categories_" + getCurrentDateTime(),
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getAllCategories();
        if (Array.isArray(result)) {
          // Parse and stringify to ensure all objects are serializable
          const serializedCategories = JSON.parse(JSON.stringify(result));
          setCategories(serializedCategories);
        } else {
          setCategories(null);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
        setCategories(null);
      }
    };
    fetchCategories();
  }, []);

  async function handleConfirmDelete(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    try {
      if (!categoryToDelete) {
        toast.error("Устгах ангилал сонгогдоогүй байна");
        return;
      }

      // Convert ObjectId to string explicitly
      const categoryId = categoryToDelete._id.toString();

      const result = await deleteCategory(categoryId);

      // Filter out the deleted category from the current state for immediate UI update
      setCategories((prevCategories) =>
        prevCategories
          ? prevCategories.filter((cat) => cat._id.toString() !== categoryId)
          : []
      );

      if (result?.success) {
        toast.success("Ангилал амжилттай устгагдлаа");
      } else {
        toast.error("Ангилал устгахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Exception during category deletion:", error);
      toast.error("Системийн алдаа: Ангилал устгахад алдаа гарлаа");
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Ангилал удирдлага</h1>
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
            <Download className="h-4 w-4" />
            EXCEL
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="cursor-pointer"
          >
            <FileText className=" h-4 w-4" />
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
          Сонгосон {table.getFilteredSelectedRowModel().rows.length} [нийт:{" "}
          {table.getRowCount()}]
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ангилал устгах</DialogTitle>
            <DialogDescription>
              Та "{categoryToDelete?.name}" ангилалыг устгахдаа итгэлтэй байна
              уу?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Цуцлах
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Устгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
