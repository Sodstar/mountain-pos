"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Save, Upload } from "lucide-react";
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
import { createUser } from "@/actions/user-action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploader } from "@/components/ui/uploadthing";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Нэр 2 тэмдэгтээс урт байх ёстой",
  }),
  email: z.string().email({
    message: "И-мэйл хаяг буруу байна",
  }),
  phone: z.string().min(8, {
    message: "Утасны дугаар буруу байна",
  }).optional(),
  password: z.string().min(6, {
    message: "Нууц үг 6 тэмдэгтээс урт байх ёстой",
  }),
  role: z.string().min(1, {
    message: "Хэрэглэгчийн эрх сонгоно уу",
  }),
  image: z.string().optional(),
});

export default function NewUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      image: "https://ui-avatars.com/api/?name=Хэрэглэгч",
      role: "user",
    },
  });

  const handleImageUpload = (url: string | undefined) => {
    if (url) {
      form.setValue("image", url);
      setUploadError(null);
    }
  };

  const handleImageError = (error: Error) => {
    console.error("Image upload error:", error);
    setUploadError("Зураг оруулахад алдаа гарлаа. UI Avatars ашиглана.");
    const name = form.getValues("name") || "Хэрэглэгч";
    form.setValue("image", `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await createUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        image: values.image,
        role: values.role,
      });

      if (result) {
        toast.success("Хэрэглэгч амжилттай үүсгэгдлээ");
        router.push("/admin/users");
      } else {
        toast.error("Хэрэглэгч үүсгэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Системийн алдаа: Хэрэглэгч үүсгэхэд алдаа гарлаа");
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
                <h1 className="text-2xl font-bold mt-2">Шинэ хэрэглэгч үүсгэх</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Хэрэглэгчийн мэдээлэл оруулах
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Хэрэглэгчийн зураг</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex flex-col space-y-2">
                          {uploadError && (
                            <div className="text-sm text-red-500">{uploadError}</div>
                          )}
                          {field.value && (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border mb-2">
                              <img 
                                src={field.value} 
                                alt="User avatar" 
                                className="w-full h-full object-cover"
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
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                const name = form.getValues("name") || "Хэрэглэгч";
                                field.onChange(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" /> UI Avatars ашиглах
                            </Button>
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
                                // Handle errors within the FileUploader component or its callbacks
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
                      И-мэйл <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="И-мэйл хаяг"
                        type="email"
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
                    <FormLabel className="flex items-center gap-1">
                      Утасны дугаар
                    </FormLabel>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Нууц үг <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Нууц үг"
                        type="password"
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
                      Эрх <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Хэрэглэгчийн эрх сонгоно уу" />
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
                  <Save className="mr-2 h-4 w-4" />
                  
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
