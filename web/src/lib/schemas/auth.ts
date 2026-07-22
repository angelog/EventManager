import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => /^\d{10,11}$/.test(value.replace(/\D/g, "")),
      "Telefone deve ter DDD + número (10 ou 11 dígitos)",
    ),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
