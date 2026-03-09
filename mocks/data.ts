import type { Store, Product } from '@/lib/types';

const initialStores: Store[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Loja Central',
    address: 'Rua das Flores, 123 - Centro',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Supermercado Norte',
    address: 'Av. Norte, 456 - Bairro Industrial',
  },
];

const initialProducts: Product[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    storeId: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Arroz 5kg',
    category: 'Alimentos',
    price: 22.9,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    storeId: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Feijão 1kg',
    category: 'Alimentos',
    price: 8.5,
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    storeId: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Detergente 500ml',
    category: 'Limpeza',
    price: 4.99,
  },
];

export const db = {
  stores: [...initialStores],
  products: [...initialProducts],
};

export function resetDb() {
  db.stores.length = 0;
  db.stores.push(...initialStores);
  db.products.length = 0;
  db.products.push(...initialProducts);
}
