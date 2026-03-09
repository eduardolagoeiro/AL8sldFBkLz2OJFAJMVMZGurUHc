import { z } from 'zod';

export const storeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  productCount: z.number().int().nonnegative().optional(),
});

export const productSchema = z.object({
  id: z.string().min(1),
  storeId: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
});

export const createStoreSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
});

export const updateStoreSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
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

export type Store = z.infer<typeof storeSchema>;
export type Product = z.infer<typeof productSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
