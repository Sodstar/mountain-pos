"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Save, Upload, Layers, Tag } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/actions/product-action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploader } from "@/components/ui/uploadthing";
import { getAllCategories } from "@/actions/category-action";
import { getAllBrands } from "@/actions/brand-action";
import { Separator } from "@/components/ui/separator";

// Define form schema with validation
const formSchema = z.object({
  code: z.string().min(2, {
    message: "Код 2 тэмдэгтээс урт байх ёстой",
  }),
  barcode: z.string().min(2, {
    message: "Баркод 2 тэмдэгтээс урт байх ёстой",
  }),
  title: z.string().min(2, {
    message: "Нэр 2 тэмдэгтээс урт байх ёстой",
  }),
  description: z.string().optional(),
  price: z.coerce.number().positive({
    message: "Үнэ нь эерэг тоо байх ёстой",
  }),
  stock: z.coerce.number().nonnegative({
    message: "Үлдэгдэл тоо хэмжээ 0 эсвэл түүнээс их байх ёстой",
  }),
  stock_alert: z.coerce.number().nonnegative({
    message: "Мэдэгдэл хязгаар 0 эсвэл түүнээс их байх ёстой",
  }),
  category: z.string().min(1, {
    message: "Ангилал сонгоно уу",
  }),
  brand: z.string().min(1, {
    message: "Бренд сонгоно уу",
  }),
  image: z.string().optional(),
});

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [brands, setBrands] = useState<any>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      barcode: "",
      title: "",
      description: "",
      price: 0,
      stock: 0,
      stock_alert: 5,
      category: "",
      brand: "",
      image: "/product.png",
    },
  });

  // Load categories and brands on mount
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        
        if (Array.isArray(brandsData)) {
          setBrands(brandsData);
        }
      } catch (error) {
        console.error("Error loading form data:", error);
        toast.error("Ангилал, брэнд мэдээлэл ачаалахад алдаа гарлаа");
      }
    };

    loadFormData();
  }, []);

  const handleImageUpload = (url: string | undefined) => {
    if (url) {
      form.setValue("image", url);
      setUploadError(null);
    }
  };

  const handleImageError = (error: Error) => {
    console.error("Image upload error:", error);
    setUploadError("Зураг оруулахад алдаа гарлаа. Placeholder ашиглана.");
    form.setValue("image", "/product.png");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await createProduct({
        code: values.code,
        barcode: values.barcode,
        title: values.title,
        description: values.description || "",
        price: values.price,
        stock: values.stock,
        stock_alert: values.stock_alert,
        category: values.category,
        brand: values.brand,
        image: values.image,
      });

      if (result) {
        toast.success("Бүтээгдэхүүн амжилттай үүсгэгдлээ");
        router.push("/admin/products");
      } else {
        toast.error("Бүтээгдэхүүн үүсгэхэд алдаа гарлаа");
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      const errorMessage = error?.message || "Системийн алдаа: Бүтээгдэхүүн үүсгэхэд алдаа гарлаа";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="border shadow-sm pt-0">
        <CardHeader className="bg-muted/40 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-2xl font-bold mt-2">Шинэ бүтээгдэхүүн үүсгэх</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Бүтээгдэхүүний мэдээлэл оруулах
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium mb-4 flex items-center">
                    <Tag className="mr-2 h-5 w-5" /> Үндсэн мэдээлэл
                  </h2>
                  
                  <div className="space-y-4">
                  <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Баркод 
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Бүтээгдэхүүний баркод"
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
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Код <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Бүтээгдэхүүний код"
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
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Нэр <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Бүтээгдэхүүний нэр"
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Тайлбар</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Бүтээгдэхүүний тайлбар"
                              {...field}
                              rows={4}
                              className="resize-none focus:ring-2 focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <h2 className="text-lg font-medium mb-4 flex items-center">
                    <Layers className="mr-2 h-5 w-5" /> Ангилал, Брэнд
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Ангилал <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Ангилал сонгоно уу" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category: any) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Брэнд <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Брэнд сонгоно уу" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand: any) => (
                                <SelectItem key={brand._id} value={brand._id}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-4">Үнэ, Үлдэгдэл</h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Үнэ <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                className="focus:ring-2 focus:ring-primary/20 pl-8"
                              />
                              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                ₮
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Үлдэгдэл <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
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
                      name="stock_alert"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            Мэдэгдэл хязгаар <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              {...field}
                              className="focus:ring-2 focus:ring-primary/20"
                            />
                          </FormControl>
                          <FormDescription>
                            Үлдэгдэл энэ хэмжээнд хүрэхэд анхааруулга өгнө
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <h2 className="text-lg font-medium mb-4">Зураг</h2>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex flex-col space-y-2">
                              {uploadError && (
                                <div className="text-sm text-red-500">{uploadError}</div>
                              )}
                              {field.value && (
                                <div className="relative w-full h-40 rounded-md overflow-hidden border mb-2">
                                  <img 
                                    src={field.value} 
                                    alt="Product image" 
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col space-y-2">
                                <Input 
                                  type="text"
                                  placeholder="Зургийн URL оруулах..."
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value)}
                                  className="focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-xs text-muted-foreground">
                                  UploadThing татаж чадахгүй байвал URL оруулах боломжтой
                                </p>
                              </div>
                              
                              <div className="mt-2">
                                <div className="text-xs text-muted-foreground">
                                  Эсвэл UploadThing ашиглах:
                                </div>
                                <div className="mt-1">
                                  <FileUploader
                                    endpoint="userImageUploader"
                                    value={field.value}
                                    onChange={handleImageUpload}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                  className="w-28"
                >
                  Цуцлах
                </Button>
                <Button type="submit" disabled={loading} className="w-28">
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                      Үүсгэж байна
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Үүсгэх
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
