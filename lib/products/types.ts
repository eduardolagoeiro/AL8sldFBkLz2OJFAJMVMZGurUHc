import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
});

export const createProductSchema = z.object({
  storeId: z.string().min(1),
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  price: z.number().nonnegative('Preço deve ser positivo'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
});

export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
