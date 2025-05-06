"use client";

import { useState } from "react";
import { 
  PieChart,
  Calendar,
  CreditCard,
  ShoppingBag,
  Box,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const recentOrders = [
    { id: 1, customer: "John Doe", total: "125,000₮", date: "Today", status: "Completed" },
    { id: 2, customer: "Jane Smith", total: "89,000₮", date: "Yesterday", status: "Processing" },
    { id: 3, customer: "Alice Johnson", total: "150,000₮", date: "2 days ago", status: "Completed" },
    { id: 4, customer: "Robert Brown", total: "75,000₮", date: "3 days ago", status: "Pending" },
  ];

  return (
    <main className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Нийт борлуулалт</p>
                <h3 className="text-2xl font-bold mt-1">1,586,400₮</h3>
                <p className="text-xs text-green-600 mt-1">+12% өмнөх 7 хоногоос</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Нийт захиалга</p>
                <h3 className="text-2xl font-bold mt-1">234</h3>
                <p className="text-xs text-green-600 mt-1">+18% өмнөх 7 хоногоос</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <ShoppingBag className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Бүтээгдэхүүн</p>
                <h3 className="text-2xl font-bold mt-1">120</h3>
                <p className="text-xs text-blue-600 mt-1">+5 шинэ нэмэгдсэн</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Box className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Хэрэглэгчид</p>
                <h3 className="text-2xl font-bold mt-1">45</h3>
                <p className="text-xs text-amber-600 mt-1">+7 шинээр бүртгүүлсэн</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-full">
                <Users className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Сарын борлуулалт</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
              <PieChart className="h-16 w-16 text-muted" />
              <p className="ml-4 text-sm text-muted-foreground">График энд харагдана</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Бараа бүтээгдэхүүний хөдөлгөөн</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
              <Calendar className="h-16 w-16 text-muted" />
              <p className="ml-4 text-sm text-muted-foreground">График энд харагдана</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Сүүлийн захиалгууд</CardTitle>
          <Button variant="outline" size="sm">Бүгдийг харах</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Захиалагч</TableHead>
                <TableHead>Огноо</TableHead>
                <TableHead>Дүн</TableHead>
                <TableHead>Төлөв</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={`${
                        order.status === "Completed" ? "bg-green-100 text-green-800 border-green-200" : 
                        order.status === "Processing" ? "bg-blue-100 text-blue-800 border-blue-200" :
                        "bg-amber-100 text-amber-800 border-amber-200"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
