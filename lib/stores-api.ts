import { apiUrl } from './api';
import type { Store } from './types';

export async function fetchStores(): Promise<Store[]> {
  const res = await fetch(apiUrl('/api/stores'));
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createStore(payload: {
  name: string;
  address: string;
}): Promise<Store> {
  const res = await fetch(apiUrl('/api/stores'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Erro ao criar loja');
  }
  return res.json();
}

export async function updateStore(
  id: string,
  payload: { name?: string; address?: string }
): Promise<Store> {
  const res = await fetch(apiUrl(`/api/stores/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Erro ao atualizar loja');
  }
  return res.json();
}

export async function deleteStore(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/stores/${id}`), { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Erro ao excluir loja');
  }
}
