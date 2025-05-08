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
  Tag,
  Users,
  LockIcon,
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
import { TUser, UserRole } from "@/models/User";
import {
  deleteUser,
  getAllUsers,
  changeUserPassword,
} from "@/actions/user-action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Password change form schema
const passwordFormSchema = z
  .object({
    password: z.string().min(6, {
      message: "Нууц үг дор хаяж 6 тэмдэгт байх ёстой.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна.",
    path: ["confirmPassword"],
  });

export interface Users {
  name: string;
  email: string;
  image: string;
  role: UserRole;
  createdAt: string;
}
const userColumnDefinitions = generateColumnDefinitions<Users>({
  name: "Нэр",
  email: "Цахим шуудан",
  image: "Зураг",
  role: "Төрөл",
  createdAt: "Бүртгэсэн огноо",
});

export default function AdminBrands() {
  const router = useRouter();
  const [users, setUsers] = useState<TUser[] | null>([]);
  const [userToDelete, setUserToDelete] = useState<TUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordChangeDialogOpen, setPasswordChangeDialogOpen] =
    useState(false);
  const [userToChangePassword, setUserToChangePassword] =
    useState<TUser | null>(null);

  // Password change form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

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

  const columns: ColumnDef<Users>[] = [
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
      accessorKey: "image",
      header: () => <div className="">Зураг</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            <img
              src={row.getValue("image")}
              className="w-12 h-12 rounded-full text-center"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Хэрэглэгчийн нэр
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            И-мэйл
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.getValue("email")}</div>
        );
      },
    },

    {
      accessorKey: "role",
      header: () => <div className="text-left">Төрөл</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">{row.getValue("role")}</div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-left">Бүртгэсэн огноо</div>,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt");
        // Format the date to YYYY-MM-DD format
        const formattedDate = createdAt
          ? new Date(createdAt as string).toISOString().split("T")[0]
          : "";
        return <div className="text-left font-medium">{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        const handleDeleteClick = () => {
          setUserToDelete(user as any);
          setDeleteDialogOpen(true);
        };

        const handlePasswordChangeClick = () => {
          setUserToChangePassword(user as any);
          setPasswordChangeDialogOpen(true);
          passwordForm.reset();
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
                  navigator.clipboard.writeText(user.name);
                  toast.success("Нэр хуулагдлаа");
                }}
              >
                Нэр хуулах
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlePasswordChangeClick}>
                <LockIcon className="h-4 w-4 mr-2" /> Нууц үг солих
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/users/${(user as any)._id}/edit`)
                }
              >
                <Edit className="h-4 w-4 mr-2" /> Засах
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick}>
                <Trash className="text-red-400 mr-2" />
                <span className="text-red-400">Устгах</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users ?? [],
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

    const columnTemplate: Users = {
      name: "",
      email: "",
      image: "",
      role: "user",
      createdAt: "",
    };
    const exportColumns = userColumnDefinitions(columnTemplate);

    exportToExcel(selectedData, exportColumns, {
      data: selectedData,
      columns: exportColumns,
      filename: "users" + getCurrentDateTime(),
      sheetName: "Users",
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
      columns: userColumnDefinitions({
        name: "",
        email: "",
        image: "",
        role: "user",
        createdAt: "",
      }),
      title: "Хэрэглэгчийн жагсаалт",
      filename: "users" + getCurrentDateTime(),
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        if (Array.isArray(result)) {
          // Parse and stringify to ensure all objects are serializable
          const serializedUsers = JSON.parse(JSON.stringify(result));
          setUsers(serializedUsers);
        } else {
          setUsers(null);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load hsers");
        setUsers(null);
      }
    };
    fetchUsers();
  }, []);

  async function handleConfirmDelete(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    event.preventDefault();
    try {
      if (!userToDelete) {
        toast.error("Устгах ангилал сонгогдоогүй байна");
        return;
      }

      // Convert ObjectId to string explicitly
      const userId = userToDelete._id.toString();

      const result = await deleteUser(userId);

      // Filter out the deleted users from the current state for immediate UI update
      setUsers((prevUsers) =>
        prevUsers
          ? prevUsers.filter((user) => user._id.toString() !== userId)
          : []
      );

      if (result?.success) {
        toast.success("Ангилал амжилттай устгагдлаа");
      } else {
        toast.error("Ангилал устгахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Exception during user deletion:", error);
      toast.error("Системийн алдаа: Ангилал устгахад алдаа гарлаа");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }

  async function handlePasswordChange(
    values: z.infer<typeof passwordFormSchema>
  ) {
    try {
      if (!userToChangePassword) {
        toast.error("Хэрэглэгч сонгогдоогүй байна");
        return;
      }

      const userId = userToChangePassword._id.toString();
      await changeUserPassword(userId, values.password);

      toast.success("Нууц үг амжилттай шинэчлэгдлээ");
      setPasswordChangeDialogOpen(false);
      passwordForm.reset();
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Нууц үг солиход алдаа гарлаа");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="h-5 w-5  mr-4" />
          Хэрэглэгч удирдлага
        </h1>
        <Button
          onClick={() => router.push("/admin/users/new")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Шинэ хэрэглэгч
        </Button>
      </div>
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
            <DialogTitle>Хэрэглэгч устгах</DialogTitle>
            <DialogDescription>
              Та "{userToDelete?.name}" хэрэглэгчийг устгахдаа итгэлтэй байна
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

      {/* Password Change Dialog */}
      <Dialog
        open={passwordChangeDialogOpen}
        onOpenChange={setPasswordChangeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Нууц үг солих</DialogTitle>
            <DialogDescription>
              {userToChangePassword && (
                <span>
                  "{userToChangePassword.name}" хэрэглэгчийн нууц үгийг
                  шинэчлэнэ.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Шинэ нууц үг</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Шинэ нууц үг"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нууц үг баталгаажуулах</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Нууц үгээ давтах"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setPasswordChangeDialogOpen(false)}
                >
                  Цуцлах
                </Button>
                <Button type="submit">Хадгалах</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
