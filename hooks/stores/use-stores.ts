import { useCallback, useEffect } from 'react';
import {
  fetchStores,
  createStore as createStoreApi,
  updateStore as updateStoreApi,
  deleteStore as deleteStoreApi,
} from '@/lib/stores';
import { useAppStore } from '@/lib/store';
import type { CreateStoreInput, Store, UpdateStoreInput } from '@/lib/stores';
import { createStoreSchema, updateStoreSchema } from '@/lib/stores';
import { formatZodMessage } from '@/lib/utils/format-zod-message';

const EMPTY_STORES: Store[] = [];

export function useStores() {
  const stores = useAppStore((state) => state.stores ?? EMPTY_STORES);
  const loading = useAppStore((state) => state.loading.stores);
  const error = useAppStore((state) => state.error.stores);
  const setStores = useAppStore((state) => state.setStores);
  const setStoresLoading = useAppStore((state) => state.setStoresLoading);
  const setStoresError = useAppStore((state) => state.setStoresError);
  const addStore = useAppStore((state) => state.addStore);
  const updateStoreInState = useAppStore((state) => state.updateStoreInState);
  const removeStore = useAppStore((state) => state.removeStore);

  const refetch = useCallback(async () => {
    setStoresLoading(true);
    setStoresError(null);
    try {
      const data = await fetchStores();
      setStores(data);
    } catch (e) {
      setStoresError(e instanceof Error ? e.message : 'Erro ao carregar lojas');
    } finally {
      setStoresLoading(false);
    }
  }, [setStores, setStoresLoading, setStoresError]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createStore = useCallback(
    async (payload: CreateStoreInput) => {
      const parsed = createStoreSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(formatZodMessage(parsed.error));
      }
      setStoresError(null);
      const store = await createStoreApi(parsed.data);
      addStore(store);
      return store;
    },
    [addStore, setStoresError]
  );

  const updateStore = useCallback(
    async (id: string, payload: UpdateStoreInput) => {
      const parsed = updateStoreSchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(formatZodMessage(parsed.error));
      }
      setStoresError(null);
      const store = await updateStoreApi(id, parsed.data);
      updateStoreInState(id, store);
      return store;
    },
    [updateStoreInState, setStoresError]
  );

  const deleteStore = useCallback(
    async (id: string) => {
      setStoresError(null);
      await deleteStoreApi(id);
      removeStore(id);
    },
    [removeStore, setStoresError]
  );

  return {
    stores,
    loading,
    error,
    refetch,
    createStore,
    updateStore,
    deleteStore,
  };
}
