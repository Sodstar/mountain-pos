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
import { getBrandById, updateBrand } from "@/actions/brand-action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Нэр 2 тэмдэгтээс урт байх ёстой",
  }),
  description: z.string().optional(),
  slug: z.string().min(2, {
    message: "Зам (slug) 2 тэмдэгтээс урт байх ёстой",
  }),
});

export default function EditBrand({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  const brandId = id;

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
    },
  });

  // Load brand data on mount
  useEffect(() => {
    const loadBrand = async () => {
      try {
        setLoading(true);

        const brandData = await getBrandById(brandId);
        if (brandData) {
          // Set form values from the fetched brand data
          form.reset({
            name: brandData.name,
            slug: brandData.slug,
          });
        } else {
          toast.error("Бренд олдсонгүй");
          router.push("/admin/brands");
        }
      } catch (error) {
        console.error("Error loading brand:", error);
        toast.error("Бренд ачаалахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    loadBrand();
  }, [brandId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await updateBrand(brandId, {
        name: values.name,
        slug: values.slug,
      });

      if (result) {
        toast.success("Бренд амжилттай шинэчлэгдлээ");
        router.push("/admin/brands");
      } else {
        toast.error("Бренд шинэчлэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Системийн алдаа: Бренд шинэчлэхэд алдаа гарлаа");
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
                <h1 className="text-2xl font-bold mt-2">Бренд засах</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Брендийн мэдээллийг шинэчлэх
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              ID: {brandId}
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
                <Skeleton className="h-24 w-full" />
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
                          placeholder="Ангиллын нэр"
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Зам (slug) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ангиллын зам"
                          {...field}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/brands")}
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
