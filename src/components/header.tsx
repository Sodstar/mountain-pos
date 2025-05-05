import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  LogInIcon,
  UserCircle,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { toMongolianCurrency } from "@/utils/formatter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";
import { DefaultSession } from "next-auth";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string | null;
    } & DefaultSession["user"];
  }
}

export default function Header({
  searchQuery,
  setSearchQuery,
  cartTotal,
  cartItemsCount,
  setSidebarOpen,
  sidebarOpen,
  setIsCartOpen,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartTotal: number;
  cartItemsCount: number;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}) {
  const { data: session, status } = useSession();
  const [sideBar, setSidebar] = useState<boolean>(false);
  const isLoading = status === "loading";
  const pathname = usePathname();
  const headerText = process.env.SYSTEM_HEADER_TEXT || "Борлуулалтын систем";
  return (
    <header className=" shadow-sm border-b py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden md:flex rounded-full cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="hidden xl:block text-[18px] font-bold bg-gradient-to-r from-primary to-green-600 text-transparent bg-clip-text uppercase dark:text-gray-100">
          {headerText}
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-3 max-w-md w-full relative">
        <Search className="h-4 w-4 absolute left-3 text-gray-400" />
        <Input
          placeholder="Хайх барааны нэр эсвэл код оруулна уу..."
          className="pl-10 rounded-full bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        {session?.user?.role === "admin" && (
          <Link href="/admin">
            <Button
              variant="default"
              size="lg"
              className="dark:bg-gray-900 dark:hover:bg-gray-800 cursor-pointer"
            >
              <LayoutDashboard className="h-5 w-5  text-white" />
              <span className="font-medium text-white">Админ</span>
            </Button>
          </Link>
        )}

        <ThemeToggle />
        {isLoading ? (
          <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
        ) : session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar className="h-9 w-9 hidden md:flex ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                <AvatarImage
                  src={session.user?.image || "https://via.placeholder.com/40"}
                  alt="User"
                />
                <AvatarFallback>
                  {session.user?.name?.[0] || "USER"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {session.user?.name || "Зочин"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.user?.email || "э-мэйл бүртгээгүй"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Хувийн мэдээлэл</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Тохиргоо</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Тусламж</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <a href="#" onClick={() => signOut({ callbackUrl: "/" })}>
                {" "}
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Гарах</span>
                </DropdownMenuItem>{" "}
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button
              variant="default"
              size="lg"
              className="dark:bg-gray-900 dark:hover:bg-gray-800 cursor-pointer"
            >
              <LogInIcon className="h-5 w-5  text-white" />
              <span className="font-medium text-white">Нэвтрэх</span>
            </Button>
          </Link>
        )}

        <Button
          onClick={() => setIsCartOpen(true)}
          variant="outline"
          size="lg"
          className="relative rounded-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {cartTotal > 0 ? `${toMongolianCurrency(cartTotal)}₮` : "Сагс"}
          </span>
          {cartItemsCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary rounded-full">
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
