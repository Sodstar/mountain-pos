// src/components/auth/login-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema } from "@/lib/validation/auth";
import Link from "next/link";
import { toast } from "sonner";
import "remixicon/fonts/remixicon.css";

type FormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem("email") || "";
      const savedPassword = localStorage.getItem("password") || "";
      
      if (savedEmail && savedPassword) {
        setRememberMe(true);
        
        // Update form values with the saved credentials
        reset({
          email: savedEmail,
          password: savedPassword
        });
      }
    }
  }, [reset]);

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);

      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem("email", data.email);
          localStorage.setItem("password", data.password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.warning("Нэвтрэх нэр эсвэл нууц үг буруу байна");
        setIsLoading(false);
        return;
      }

      toast.success("Тавтай морилно уу!");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Алдаа");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Нэвтрэх</CardTitle>
        <CardDescription>Та нэвтрэх мэдээллээ оруулна уу </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">И-мэйл хаяг</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.mn"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Нууц үг</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="rememberMe" className="text-sm">
              Сануулах
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
