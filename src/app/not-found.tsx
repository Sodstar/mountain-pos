"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MountainSnow } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 ">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-gray-100 p-6 rounded-full">
            <MountainSnow className="h-16 w-16" />
          </div>
        </div>
        
        <h1 className="text-8xl font-bold">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Хуудас олдсонгүй
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          Таны хайсан хуудас олдсонгүй эсвэл шилжүүлэгдсэн байна.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            Буцах
          </Button>
          
          <Link href="/">
            <Button className="w-full sm:w-auto">
              Нүүр хуудас руу буцах
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
