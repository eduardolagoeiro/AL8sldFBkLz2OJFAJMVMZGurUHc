import { useCallback, useEffect } from 'react';
import {
  fetchProducts,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from './products-api';
import { useAppStore } from './store';
import type { CreateProductInput, UpdateProductInput } from './types';
import { createProductSchema, updateProductSchema } from './types';
import { formatZodMessage } from './format-zod-message';

export function useProducts(storeId: string | null) {
  const products = useAppStore((state) =>
    storeId ? (state.productsByStore[storeId] ?? []) : []
  );
  const loading = useAppStore((state) => state.loading.products);
  const error = useAppStore((state) => state.error.products);
  const setProducts = useAppStore((state) => state.setProducts);
  const setProductsLoading = useAppStore((state) => state.setProductsLoading);
  const setProductsError = useAppStore((state) => state.setProductsError);
  const addProduct = useAppStore((state) => state.addProduct);
  const updateProductInState = useAppStore(
    (state) => state.updateProductInState
  );
  const removeProduct = useAppStore((state) => state.removeProduct);

  const refetch = useCallback(async () => {
    if (!storeId) return;
    setProductsLoading(true);
    setProductsError(null);
    try {
      const data = await fetchProducts(storeId);
      setProducts(storeId, data);
    } catch (e) {
      setProductsError(
        e instanceof Error ? e.message : 'Erro ao carregar produtos'
      );
    } finally {
      setProductsLoading(false);
    }
  }, [storeId, setProducts, setProductsLoading, setProductsError]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createProduct = useCallback(
    async (payload: CreateProductInput) => {
      const parsed = createProductSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(formatZodMessage(parsed.error));
      }
      if (parsed.data.storeId !== storeId) {
        throw new Error('storeId não corresponde à loja selecionada');
      }
      setProductsError(null);
      const product = await createProductApi(parsed.data);
      addProduct(product);
      return product;
    },
    [storeId, addProduct, setProductsError]
  );

  const updateProduct = useCallback(
    async (id: string, payload: UpdateProductInput) => {
      const parsed = updateProductSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(formatZodMessage(parsed.error));
      }
      setProductsError(null);
      const product = await updateProductApi(id, parsed.data);
      updateProductInState(id, product);
      return product;
    },
    [updateProductInState, setProductsError]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!storeId) return;
      setProductsError(null);
      await deleteProductApi(id);
      removeProduct(storeId, id);
    },
    [storeId, removeProduct, setProductsError]
  );

  return {
    products,
    loading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
