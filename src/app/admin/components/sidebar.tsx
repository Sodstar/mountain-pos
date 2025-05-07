"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Home,
  Box,
  Settings,
  Users,
  LogOut,
  ShoppingBag,
  CreditCard,
  X,
  Tag,
  ListTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const router = useRouter();
  const menuItems = [
    {
      id: "dashboard",
      name: "Хянах самбар",
      icon: <Home className="h-5 w-5" />,
      link: "/admin",
    },
    {
      id: "categories",
      name: "Ангилал",
      icon: <ListTree className="h-5 w-5" />,
      link: "/admin/categories",
    },
    {
      id: "brand",
      name: "Бренд",
      icon: <Tag className="h-5 w-5" />,
      link: "/admin/brands",
    },
    {
      id: "products",
      name: "Бараа",
      icon: <ShoppingBag className="h-5 w-5" />,
      link: "/admin/products",
    },
    {
      id: "sale",
      name: "Борлуулалт",
      icon: <Box className="h-5 w-5" />,
      link: "/admin/sale",
    },
    {
      id: "order",
      name: "Захиалга",
      icon: <CreditCard className="h-5 w-5" />,
      link: "/admin/order",
    },
    {
      id: "users",
      name: "Хэрэглэгч",
      icon: <Users className="h-5 w-5" />,
      link: "/admin/users",
    },
    {
      id: "settings",
      name: "Тохиргоо",
      icon: <Settings className="h-5 w-5" />,
      link: "/admin/settings",
    },
  ];

  const { theme } = useTheme(); // Get the current theme
  const [color, setColor] = useState<string | null>("");

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setColor(currentTheme);
    } else {
      setColor("light");
    }
  }, [theme]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-background border-r transform transition-transform duration-200 ease-in-out
        lg:relative lg:transform-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col p-4 border-b">
          <div className="flex items-center justify-center">
            <img
              src={color === "dark" ? "/logo-white.png" : "/logo.png"}
              alt="Logo"
              className="w-42"
            />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                  router.push(item.link);
                }}
                className={`w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 transition-colors ${
                  activeMenu === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-gray-100 text-gray-700 dark:hover:bg-primary/10 dark:text-gray-300"
                }`}
              >
                <span
                  className={`p-1.5 rounded-lg ${
                    activeMenu === item.id
                      ? "bg-primary/20"
                      : "bg-gray-100 dark:bg-primary/10"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {activeMenu === item.id && (
                  <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                )}
              </button>
            ))}

            <div className="mt-6 pt-4 border-t">
              <button className="w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900" onClick={() => signOut({ callbackUrl: "/" })}>
                <span className="p-1.5 rounded-lg bg-red-100 dark:bg-gray-900">
                  <LogOut className="h-5 w-5 text-red-400" />
                </span>
                <span className="text-red-400">Гарах</span>
              </button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
