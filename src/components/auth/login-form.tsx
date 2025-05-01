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

  useEffect(() => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    if (email && password) {
      setRememberMe(true);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem("email") || "",
      password: localStorage.getItem("password") || "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);

      if (rememberMe) {
        localStorage.setItem("email", data.email);
        localStorage.setItem("password", data.password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast("Нэвтрэх нэр эсвэл нууц үг буруу байна");
        setIsLoading(false);
        return;
      }

      toast("Тавтай морилно уу!");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast("Алдаа");
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
              className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">
              Сануулах
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </Button>
        </form>
        {/* <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading}
          onClick={() => signIn("google")}
        >
          <i className="ri-google-fill"></i> Google Login
        </Button>
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading}
          onClick={() => signIn("facebook")}
        >
          <i className="ri-facebook-fill"></i> Facebook Login
        </Button>
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading}
          onClick={() => signIn("github")}
        >
          <i className="ri-github-fill"></i> Github Login
        </Button>
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isLoading}
          onClick={() => signIn("linkedin")}
        >
          <i className="ri-linkedin-fill"></i> Linkedin Login
        </Button> */}
      </CardContent>

    </Card>
  );
}
