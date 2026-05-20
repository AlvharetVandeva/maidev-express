import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().optional(),
  role: z.enum(["admin", "courier", "customer"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
