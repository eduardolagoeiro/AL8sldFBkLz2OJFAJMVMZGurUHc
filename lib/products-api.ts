import { apiUrl } from './api';
import type { Product } from './types';

export async function fetchProducts(storeId: string): Promise<Product[]> {
  const res = await fetch(
    apiUrl(`/api/products?storeId=${encodeURIComponent(storeId)}`)
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createProduct(payload: {
  storeId: string;
  name: string;
  category: string;
  price: number;
}): Promise<Product> {
  const res = await fetch(apiUrl('/api/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Erro ao cadastrar produto');
  }
  return res.json();
}

export async function updateProduct(
  id: string,
  payload: { name?: string; category?: string; price?: number }
): Promise<Product> {
  const res = await fetch(apiUrl(`/api/products/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Erro ao atualizar produto');
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/products/${id}`), {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Erro ao excluir produto');
  }
}
