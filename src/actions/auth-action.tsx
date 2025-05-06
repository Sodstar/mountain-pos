// src/lib/actions/auth-actions.ts
"use server";

import { z } from "zod";
import { registerSchema, loginSchema } from "@/lib/validation/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";
import AuthError from "next-auth";
import { revalidatePath } from "next/cache";

export async function register(values: z.infer<typeof registerSchema>) {
  // Validate form data
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { name, email, phone, password, role } = validatedFields.data;

  try {
    await connectDB();

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return { error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role, // Include the role
    });
    revalidatePath("/register");
    return { success: "User registered successfully" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register user" };
  }
}

export async function login(values: z.infer<typeof loginSchema>) {
  // Validate form data
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Login successful" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    return { error: "Failed to login" };
  }
}

// New function to check if user is admin
export async function checkIsAdmin(userId: string) {
  try {
    await connectDB();
    const user = await User.findById(userId);
    return user?.role === "admin";
  } catch (error) {
    return false;
  }
}
