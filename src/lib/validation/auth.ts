// src/lib/validations/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Доод тал нь 2 нэмдэгт байна" }),
  email: z.string().email({ message: "Зөв цахим шуудан орууна уу" }),
  phone: z.string(),
  password: z.string().min(6, {
    message: "Зөв цахим шуудан орууна уу",
  }),
  role: z.enum(["user", "admin"]).default("user"),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Зөв цахим шуудан орууна уу" }),
  password: z.string().min(6, {
    message: "Доод тал нь 6 нэмдэгт байна",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;