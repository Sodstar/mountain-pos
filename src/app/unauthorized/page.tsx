"use client"; // src/app/unauthorized/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-6">
        <h1 className="text-3xl font-bold text-red-600">
          Хандах боломжгүй байна
        </h1>
        <p className="text-xl">
          Танд энэхүү хуудсанд хандах эрх олгогдоогүй байна.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#"
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
          >
            <Button variant="outline">Гарах</Button>
          </Link>
          <Link href="/">
            <Button>Нүүр хуудас</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
