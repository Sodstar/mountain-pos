import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center mb-6 w-36 ">
        <Button
          variant="ghost"
          size="lg"
          asChild
          className="flex items-center gap-1"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Буцах</span>
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">
        Тусламж
      </h1>

      <div className="max-w-md mx-auto grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Холбоо барих мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">И-мэйл хаяг</p>
                <p className="text-sm text-muted-foreground">it@nhs.edu.mn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Тусламжийн цаг</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Манай тусламжийн баг Даваа-Баасан гарагт, 9:00-17:00 цагийн
              хооронд ажилладаг.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
