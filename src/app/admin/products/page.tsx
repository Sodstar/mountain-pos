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
  Plus,
  Package,
  FilterX,
  ShoppingBag,
  AlertTriangle,
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
import { exportToExcel, exportToPDF } from "@/utils/exportHelpers";
import { getCurrentDateTime } from "@/utils/datetime";
import { toast } from "sonner";
import { generateColumnDefinitions } from "@/utils/generation";
import { TProduct } from "@/models/Product";
import {
  getFilteredProducts,
  deleteProduct,
  fetchFilteredProducts,
} from "@/actions/product-action";
import { getAllCategories } from "@/actions/category-action";
import { getAllBrands } from "@/actions/brand-action";
import { Types } from "mongoose";
import { toMongolianCurrency } from "@/utils/formatter";
import { Combobox } from "@/components/ui/combobox";

export interface Products {
  code: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  stock_alert: number;
  views: number;
  category: { _id: string; name: string; description: string; slug: string };
  brand: { _id: string; name: string; slug: string };
}

const productColumnDefinitions = generateColumnDefinitions<Products>({
  code: "Код",
  title: "Нэр",
  price: "Үнэ",
  stock: "Үлдэгдэл",
  stock_alert: "Мэдэгдэл",
  views: "Харсан",
  category: "Ангилал",
  brand: "Брэнд",
  description: "Дэлгэрэнгүй",
});

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any | null>([]);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const columns: ColumnDef<Products>[] = [
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
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Код
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "title",
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
        <div className="lowercase">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Үнэ
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formattedPrice = toMongolianCurrency(price);

        return <div className="text-left font-medium">{formattedPrice}₮</div>;
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Үлдэгдэл
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const stock = parseFloat(row.getValue("stock"));
        const stock_alert = parseFloat(row.getValue("stock_alert"));
        const isLowStock = stock <= stock_alert;
        const stockStyle = isLowStock
          ? "text-red-500 font-medium"
          : "text-green-500 font-medium";
        const formatted = new Intl.NumberFormat("mn-MN", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(stock);
        return (
          <div className={`text-left ${stockStyle}`}>
            {formatted} {isLowStock && <span className="text-red-500"></span>}
          </div>
        );
      },
    },
    {
      accessorKey: "stock_alert",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Мэдэгдэл
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const stock_alert = parseFloat(row.getValue("stock_alert"));
        return <div className="text-left font-medium">{stock_alert}</div>;
      },
    },
    {
      accessorKey: "views",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Харсан
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const views = parseFloat(row.getValue("views"));
        return <div className="text-left font-medium">{views}</div>;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ангилал
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const category = row.getValue("category") as { name: string } | null;
        return <div>{category?.name || "Хоосон"}</div>;
      },
    },
    {
      accessorKey: "brand",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Брэнд
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const brand = row.getValue("brand") as { name: string } | null;
        return <div>{brand?.name || "Хоосон"}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        const handleDeleteClick = () => {
          setProductToDelete(product as any);
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
                  navigator.clipboard.writeText(product.title);
                  toast.success("Нэр хуулагдлаа");
                }}
              >
                Нэр хуулах
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/products/${(product as any)._id}/edit`)
                }
              >
                <Edit className="h-4 w-4" /> Засах
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
    data: products ?? [],
    columns: columns as ColumnDef<TProduct, any>[],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    filterFns: {
      multiColumnFilter: (row, columnId, filterValue) => {
        const value = String(row.getValue(columnId) || "").toLowerCase();
        return value.includes(String(filterValue).toLowerCase());
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter: searchTerm,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchLower = filterValue.toLowerCase();
      const title = String(row.getValue("title") || "").toLowerCase();
      if (title.includes(searchLower)) return true;

      const code = String(row.getValue("code") || "").toLowerCase();
      if (code.includes(searchLower)) return true;

      return false;
    },
  });

  const handleExportXLS = () => {
    if (table.getFilteredSelectedRowModel().rows.length === 0) {
      toast.warning("Сонголт хийгээгүй байна");
      return;
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    // Transform the data to ensure objects are properly formatted
    const selectedData = selectedRows.map((row) => {
      const item = row.original;
      return {
        ...item,
        category:
          typeof item.category === "object" && "name" in item.category
            ? item.category.name
            : "Хоосон",
        brand:
          typeof item.brand === "object" && "name" in item.brand
            ? item.brand.name
            : "Хоосон",
      };
    });

    const columnTemplate: Products = {
      code: "",
      title: "",
      price: 0,
      stock: 0,
      stock_alert: 0,
      views: 0,
      category: { _id: "", name: "", description: "", slug: "" },
      brand: { _id: "", name: "", slug: "" },
      description: "",
    };
    const exportColumns = productColumnDefinitions(columnTemplate);

    exportToExcel(selectedData, exportColumns, {
      data: selectedData,
      columns: exportColumns,
      filename: "products_" + getCurrentDateTime(),
      sheetName: "Products",
    });
  };

  const handleExportPDF = () => {
    if (table.getFilteredSelectedRowModel().rows.length === 0) {
      toast.warning("Сонголт хийгээгүй байна");
      return;
    }

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    // Transform the data to ensure objects are properly formatted
    const selectedData = selectedRows.map((row) => {
      const item = row.original;
      return {
        ...item,
        category:
          typeof item.category === "object" && "name" in item.category
            ? item.category.name
            : "Хоосон",
        brand:
          typeof item.brand === "object" && "name" in item.brand
            ? item.brand.name
            : "Хоосон",
      };
    });

    exportToPDF({
      data: selectedData,
      columns: productColumnDefinitions({
        code: "",
        title: "",
        price: 0,
        stock: 0,
        stock_alert: 0,
        views: 0,
        category: { _id: "", name: "", description: "", slug: "" },
        brand: { _id: "", name: "", slug: "" },
        description: "",
      }),
      title: "Бүтээгдэхүүн жагсаалт",
      filename: "products_" + getCurrentDateTime(),
    });
  };

  // Load categories and brands
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);

        setCategories(categoriesData || []);
        setBrands(brandsData || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        toast.error("Failed to load filter options");
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Create filters object
        const filters: any = {};

        if (selectedCategory) {
          filters.category = selectedCategory;
        }

        if (selectedBrand) {
          filters.brand = selectedBrand;
        }

        if (lowStockFilter) {
          filters.lowStock = true;
        }

        filters.orderBy = "title_asc";
        const result = await fetchFilteredProducts(filters);

        if (result && Array.isArray(result)) {
          setProducts(result);
          console.log("Products fetched successfully:", result);
        } else {
          console.log("No products found or invalid data format");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, lowStockFilter]);

  useEffect(() => {
    table.setGlobalFilter(searchTerm);
  }, [searchTerm, table]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setLowStockFilter(false);
  };

  async function handleConfirmDelete(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    try {
      if (!productToDelete) {
        toast.error("Устгах бүтээгдэхүүн сонгогдоогүй байна");
        return;
      }

      // Convert ObjectId to string explicitly
      const productId = productToDelete._id.toString();
      console.log(productId);

      const result = await deleteProduct(productId);

      // Filter out the deleted product from the current state for immediate UI update
      setProducts((prevProducts: any) =>
        prevProducts
          ? prevProducts.filter(
              (product: any) => product._id.toString() !== productId
            )
          : []
      );

      if (result.success) {
        toast.success("Бүтээгдэхүүн амжилттай устгагдлаа");
      } else {
        toast.error("Бүтээгдэхүүн устгахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Exception during product deletion:", error);
      toast.error("Системийн алдаа: Бүтээгдэхүүн устгахад алдаа гарлаа");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold flex items-center">
          <ShoppingBag className="h-5 w-5 mr-4" />
          Бүтээгдэхүүн удирдлага
        </h1>
        <Button
          onClick={() => router.push("/admin/products/new")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Шинэ бүтээгдэхүүн
        </Button>
      </div>

      <div className="flex items-center py-4 flex-wrap gap-4">
        {/* Replace the existing search input with this one */}
        <Input
          placeholder="Нэр эсвэл кодоор хайлт хийх..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />

        {/* Category filter */}
        <Combobox
          options={categories.map((cat) => ({
            value: cat.slug,
            label: cat.name,
          }))}
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          placeholder="Ангилал сонгох"
          emptyText="Ангилал олдсонгүй"
          triggerClassName="w-[200px]"
          className="max-h-[350px] overflow-y-auto"
        />

        {/* Brand filter */}
        <Combobox
          options={brands.map((brand) => ({
            value: brand.slug,
            label: brand.name,
          }))}
          value={selectedBrand}
          onValueChange={setSelectedBrand}
          placeholder="Брэнд сонгох"
          emptyText="Брэнд олдсонгүй"
          triggerClassName="w-[200px]"
          className="max-h-[350px] overflow-y-auto"
        />

        {/* Low Stock Filter Button */}
        <Button
          variant={lowStockFilter ? "default" : "outline"}
          onClick={() => setLowStockFilter(!lowStockFilter)}
          className="flex items-center gap-2"
          title="Бага үлдэгдэлтэй бараа"
        >
          <AlertTriangle
            className={`h-4 w-4 ${
              lowStockFilter ? "text-white" : "text-red-500"
            }`}
          />
          {lowStockFilter ? "Бага үлдэгдэл" : "Бага үлдэгдэл"}
        </Button>

        {/* Reset filters button */}
        {(selectedCategory || selectedBrand || lowStockFilter) && (
          <Button
            variant="outline"
            onClick={handleResetFilters}
            size="icon"
            title="Шүүлтүүр цэвэрлэх"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        )}

        {/* Export buttons */}
        <div className="flex space-x-2 ml-auto">
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

        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
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

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
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
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
        Сонгосон {table.getFilteredSelectedRowModel().rows.length} [нийт:{" "}
          {table.getRowCount()}]
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 15, 25, 50, 100, 250, 500, 1000].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Устгах уу?</DialogTitle>
            <DialogDescription>
              {productToDelete && (
                <>
                  Та <strong>{productToDelete.title}</strong> нэртэй
                  бүтээгдэхүүн устгахдаа итгэлтэй байна уу?
                </>
              )}
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
