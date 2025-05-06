// src/app/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authConfig);
  
  if (session) {
    redirect("/dashboard");
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}