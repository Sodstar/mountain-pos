"use client";

import { Home, LogInIcon, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/theme-toggle";
import { useSession } from "next-auth/react";
import Link from "next/link";
interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  setSidebarOpen,
  title = "Системийн удирдлага",
  subtitle = "Сайн байна уу, ",
}: HeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className="border-b py-4 px-6 bg-card">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {subtitle} {session?.user?.name || "Админ"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="default"
              size="lg"
              className=" dark:bg-primary/10 dark:hover:bg-primary/20  cursor-pointer"
            >
              <Home className="h-5 w-5  text-white" />
              <span className="font-medium text-white">POS</span>
            </Button>
          </Link>
          <ThemeToggle />
          <Avatar className="h-9 w-9 hidden md:flex ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
            <AvatarImage
              src={session?.user?.image || "https://via.placeholder.com/40"}
              alt="User"
            />
            <AvatarFallback>
              {session?.user?.name?.[0] || "USER"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
