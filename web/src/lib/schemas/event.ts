import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  description: z.string().trim().optional(),
  date: z
    .string()
    .min(1, "Data é obrigatória")
    .refine((value) => {
      const parsed = new Date(value);
      return !Number.isNaN(parsed.getTime()) && parsed > new Date();
    }, "A data deve ser futura"),
});

export type EventFormValues = z.infer<typeof eventSchema>;
