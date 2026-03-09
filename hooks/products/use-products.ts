import { useCallback, useEffect, useMemo } from 'react';
import {
  fetchProducts,
  fetchAllProducts,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from '@/lib/products';
import { useAppStore } from '@/lib/store';
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/lib/products';
import { createProductSchema, updateProductSchema } from '@/lib/products';
import { formatZodMessage } from '@/lib/utils/format-zod-message';

const EMPTY_PRODUCTS: Product[] = [];

export function useProducts(storeId: string | null) {
  const productsByStore = useAppStore((state) => state.productsByStore);
  const loading = useAppStore((state) => state.loading.products);
  const error = useAppStore((state) => state.error.products);
  const setProducts = useAppStore((state) => state.setProducts);
  const setProductsFromList = useAppStore((state) => state.setProductsFromList);
  const setProductsLoading = useAppStore((state) => state.setProductsLoading);
  const setProductsError = useAppStore((state) => state.setProductsError);
  const addProduct = useAppStore((state) => state.addProduct);
  const updateProductInState = useAppStore(
    (state) => state.updateProductInState
  );
  const removeProduct = useAppStore((state) => state.removeProduct);

  const products = useMemo(() => {
    if (storeId) return productsByStore[storeId] ?? EMPTY_PRODUCTS;
    return Object.values(productsByStore).flat();
  }, [storeId, productsByStore]);

  const refetch = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      if (storeId) {
        const data = await fetchProducts(storeId);
        setProducts(storeId, data);
      } else {
        const data = await fetchAllProducts();
        setProductsFromList(data);
      }
    } catch (e) {
      setProductsError(
        e instanceof Error ? e.message : 'Erro ao carregar produtos'
      );
    } finally {
      setProductsLoading(false);
    }
  }, [
    storeId,
    setProducts,
    setProductsFromList,
    setProductsLoading,
    setProductsError,
  ]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createProduct = useCallback(
    async (payload: CreateProductInput) => {
      if (!storeId)
        throw new Error('Selecione uma loja para adicionar produto');
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
    async (id: string, productStoreId: string) => {
      setProductsError(null);
      await deleteProductApi(id);
      removeProduct(productStoreId, id);
    },
    [removeProduct, setProductsError]
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
