"use client"
import { Box, ChevronRight, Settings, User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useTheme } from "next-themes"; // Import useTheme hook
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar({
  activeCategory,
  setActiveCategory,
  CATEGORIES,
}: {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  CATEGORIES: any;
}) {
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
    <div className="h-full border-r  flex flex-col items-center">
      <div className="w-full">
        <div className="flex flex-col p-4 border-b  items-center justify-between cursor-pointer">
          <Link href="/">
            <img
              src={color === "dark" ? "/logo-white.png" : "/logo.png"}
              alt="Logo"
              className="w-42"
            />
          </Link>
        </div>

        <ScrollArea className="flex-1 px-8 py-6"  style={{ height: "calc(100vh - 120px)" }}>
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
              Барааны ангилал
            </h3>
            {CATEGORIES.map((category: any) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 transition-colors ${
                  activeCategory === category.id
                    ? "bg-primary/10 text-primary font-medium dark:bg-gray-900"
                    : "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-900"
                }`}
              >
                <span
                  className={`p-1.5 rounded-lg ${
                    activeCategory === category.id
                      ? "bg-primary/20 dark:bg-gray-900"
                      : "bg-gray-100 dark:bg-gray-900 "
                  }`}
                >
                  {category.icon}
                </span>
                <span className="dark:text-gray-200">{category.name}</span>
                {activeCategory === category.id && (
                  <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
              Админ тохиргоо
            </h3>
            <button className="w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 ">
              <span className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900">
                <Box className="h-5 w-5" />
              </span>
              <span>Бараа</span>
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900">
              <span className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900">
                <User className="h-5 w-5" />
              </span>
              <span>Хэрэглэгч</span>
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900">
              <span className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900">
                <Settings className="h-5 w-5" />
              </span>
              <span>Тохиргоо</span>
            </button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
