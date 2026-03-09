import { http, HttpResponse } from 'msw';
import { API_BASE } from '@/lib/api';
import type { Store, Product } from '@/lib/types';
import { db } from './data';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const base = `${API_BASE.replace(/\/$/, '')}/api`;

export const handlers = [
  http.get(`${base}/stores`, () => {
    const storesWithCount = db.stores.map((store) => ({
      ...store,
      productCount: db.products.filter((p) => p.storeId === store.id).length,
    }));
    return HttpResponse.json(storesWithCount);
  }),

  http.post(`${base}/stores`, async ({ request }) => {
    const body = (await request.json()) as { name?: string; address?: string };
    if (!body.name?.trim() || !body.address?.trim()) {
      return HttpResponse.json(
        { error: 'Nome e endereço são obrigatórios' },
        { status: 400 }
      );
    }
    const store: Store = {
      id: generateId(),
      name: body.name.trim(),
      address: body.address.trim(),
    };
    db.stores.push(store);
    return HttpResponse.json(store, { status: 201 });
  }),

  http.put<{ id: string }>(
    `${base}/stores/:id`,
    async ({ request, params }) => {
      const id = params.id;
      const store = db.stores.find((s) => s.id === id);
      if (!store) {
        return HttpResponse.json(
          { error: 'Loja não encontrada' },
          { status: 404 }
        );
      }
      const body = (await request.json()) as {
        name?: string;
        address?: string;
      };
      if (body.name !== undefined) store.name = String(body.name).trim();
      if (body.address !== undefined)
        store.address = String(body.address).trim();
      if (!store.name || !store.address) {
        return HttpResponse.json(
          { error: 'Nome e endereço são obrigatórios' },
          { status: 400 }
        );
      }
      return HttpResponse.json(store);
    }
  ),

  http.delete<{ id: string }>(`${base}/stores/:id`, ({ params }) => {
    const id = params.id;
    const index = db.stores.findIndex((s) => s.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      );
    }
    db.stores.splice(index, 1);
    db.products = db.products.filter((p) => p.storeId !== id);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.get(`${base}/products`, ({ request }) => {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');
    if (!storeId) {
      return HttpResponse.json(
        { error: 'storeId é obrigatório' },
        { status: 400 }
      );
    }
    const products = db.products.filter((p) => p.storeId === storeId);
    return HttpResponse.json(products);
  }),

  http.post(`${base}/products`, async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      category?: string;
      price?: number;
      storeId?: string;
    };
    if (
      !body.name?.trim() ||
      !body.category?.trim() ||
      body.price === undefined ||
      !body.storeId
    ) {
      return HttpResponse.json(
        { error: 'Nome, categoria, preço e storeId são obrigatórios' },
        { status: 400 }
      );
    }
    const store = db.stores.find((s) => s.id === body.storeId);
    if (!store) {
      return HttpResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      );
    }
    const product: Product = {
      id: generateId(),
      storeId: body.storeId,
      name: body.name.trim(),
      category: body.category.trim(),
      price: Number(body.price),
    };
    db.products.push(product);
    return HttpResponse.json(product, { status: 201 });
  }),

  http.put<{ id: string }>(
    `${base}/products/:id`,
    async ({ request, params }) => {
      const id = params.id;
      const product = db.products.find((p) => p.id === id);
      if (!product) {
        return HttpResponse.json(
          { error: 'Produto não encontrado' },
          { status: 404 }
        );
      }
      const body = (await request.json()) as {
        name?: string;
        category?: string;
        price?: number;
      };
      if (body.name !== undefined) product.name = String(body.name).trim();
      if (body.category !== undefined)
        product.category = String(body.category).trim();
      if (body.price !== undefined) product.price = Number(body.price);
      if (!product.name || !product.category) {
        return HttpResponse.json(
          { error: 'Nome e categoria são obrigatórios' },
          { status: 400 }
        );
      }
      return HttpResponse.json(product);
    }
  ),

  http.delete<{ id: string }>(`${base}/products/:id`, ({ params }) => {
    const id = params.id;
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    db.products.splice(index, 1);
    return HttpResponse.json(null, { status: 204 });
  }),
];
