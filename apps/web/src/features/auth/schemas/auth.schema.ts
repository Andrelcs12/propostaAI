import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido"),
  password: z.string().min(6, "Informe sua senha")
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("Informe um e-mail valido"),
  password: z.string().min(6, "Use pelo menos 6 caracteres")
});

export const recoverPasswordSchema = z.object({
  email: z.string().email("Informe um e-mail valido")
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Use pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha")
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas precisam ser iguais"
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RecoverPasswordInput = z.infer<typeof recoverPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
