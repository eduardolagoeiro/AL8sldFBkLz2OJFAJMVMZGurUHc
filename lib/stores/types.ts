import { z } from 'zod';

export const storeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  productCount: z.number().int().nonnegative().optional(),
});

export const createStoreSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
});

export const updateStoreSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
});

export type Store = z.infer<typeof storeSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
