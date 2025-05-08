"use client";

import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUserById, updateUser } from "@/actions/user-action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Нэр 2 тэмдэгтээс урт байх ёстой",
  }),
  email: z.string().email({
    message: "Зөв имэйл оруулна уу",
  }),
  phone: z.string().optional(),
  role: z.string().min(1, {
    message: "Үүрэг сонгоно уу",
  }),
});

export default function EditUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  const userId = id;

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
    },
  });

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const userData = await getUserById(userId);
        if (userData) {
          // Set form values from the fetched user data
          form.reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            role: userData.role,
          });
        } else {
          toast.error("Хэрэглэгч олдсонгүй");
          router.push("/admin/users");
        }
      } catch (error) {
        console.error("Error loading user:", error);
        toast.error("Хэрэглэгч ачаалахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await updateUser(userId, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
      });

      if (result) {
        toast.success("Хэрэглэгч амжилттай шинэчлэгдлээ");
        router.push("/admin/users");
      } else {
        toast.error("Хэрэглэгч шинэчлэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Системийн алдаа: Хэрэглэгч шинэчлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="border shadow-sm pt-0">
        <CardHeader className="bg-muted/40 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-2xl font-bold mt-2">Хэрэглэгч засах</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Хэрэглэгчийн мэдээллийг шинэчлэх
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              ID: {userId}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Нэр <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Хэрэглэгчийн нэр"
                          {...field}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Имэйл <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Имэйл хаяг"
                          {...field}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Утасны дугаар</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Утасны дугаар"
                          {...field}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Үүрэг <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Үүрэг сонгоно уу" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">Хэрэглэгч</SelectItem>
                          <SelectItem value="admin">Админ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/users")}
                    className="w-28"
                  >
                    Цуцлах
                  </Button>
                  <Button type="submit" disabled={loading} className="w-28">
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                        Хадгалж байна
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Хадгалах
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
