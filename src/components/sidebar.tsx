"use client";
import {
  Box,
  ChevronRight,
  Rabbit,
  Search,
  Settings,
  Tag,
  User,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useTheme } from "next-themes"; // Import useTheme hook
import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

export default function Sidebar({
  activeBrand,
  setActiveBrand,
  BRANDS,
}: {
  activeBrand: string;
  setActiveBrand: (category: string) => void;
  BRANDS: any;
}) {
  const { theme } = useTheme();
  const [color, setColor] = useState<string | null>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      setColor(currentTheme);
    } else {
      setColor("light");
    }
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

        <ScrollArea
          className="flex-1 px-8 py-6"
          style={{ height: "calc(100vh - 120px)" }}
        >
          <div className="space-y-1">
            <h3 className="text-xs font-medium uppercase tracking-wider px-3 mb-2">
              Барааны брендүүд
            </h3>

            {loading ? (
              <div className="flex flex-col  items-center gap-4 ">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="  w-full  h-12 rounded-lg bg-gray-200 dark:bg-primary/10 transition-colors"
                  />
                ))}
              </div>
            ) : BRANDS.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Rabbit className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-2">Бренд олдсонгүй</h3>
                <p>Та түр хүлээгээд дахин оролдоно уу!</p>
              </div>
            ) : (
              <div>
                {BRANDS.map((brand: any) => (
                  <button
                    key={brand._id}
                    onClick={() => setActiveBrand(brand._id)}
                    className={`w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 transition-colors ${
                      activeBrand === brand._id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-gray-100 text-gray-700 dark:hover:bg-primary/10 dark:text-gray-300"
                    }`}
                  >
                    <span
                      className={`p-1.5 rounded-lg ${
                        activeBrand === brand._id
                          ? "bg-primary/20"
                          : "bg-gray-100 dark:bg-primary/10"
                      }`}
                    >
                      <Tag className="h-5 w-5" />
                    </span>
                    <span className="dark:text-gray-200">{brand.name}</span>
                    {activeBrand === brand._id && (
                      <ChevronRight className="h-4 w-4 ml-auto text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
