import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email mohon diisi !")
    .email("Email tidak valid !"),
  password: z
    .string()
    .min(1, "Kata Sandi mohon diisi !"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama mohon diisi !"),
    email: z
      .string()
      .min(1, "Email mohon diisi !")
      .email("Email tidak valid !"),
    password: z
      .string()
      .min(1, "Kata Sandi mohon diisi !")
      .min(6, "Kata Sandi minimal 6 karakter !"),
    password_confirmation: z
      .string()
      .min(1, "Konfirmasi Kata Sandi mohon diisi !"),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["password_confirmation"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
