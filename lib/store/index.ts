import { create } from 'zustand';
import type { Store } from '@/lib/stores';
import type { Product } from '@/lib/products';

interface AppState {
  stores: Store[];
  productsByStore: Record<string, Product[]>;
  selectedStoreId: string | null;
  loading: { stores: boolean; products: boolean };
  error: { stores: string | null; products: string | null };

  setStores: (stores: Store[]) => void;
  setProducts: (storeId: string, products: Product[]) => void;
  setProductsFromList: (products: Product[]) => void;
  setSelectedStoreId: (storeId: string | null) => void;
  setStoresLoading: (loading: boolean) => void;
  setProductsLoading: (loading: boolean) => void;
  setStoresError: (error: string | null) => void;
  setProductsError: (error: string | null) => void;

  addStore: (store: Store) => void;
  updateStoreInState: (id: string, data: Partial<Store>) => void;
  removeStore: (id: string) => void;

  addProduct: (product: Product) => void;
  updateProductInState: (id: string, data: Partial<Product>) => void;
  removeProduct: (storeId: string, productId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  stores: [],
  productsByStore: {},
  selectedStoreId: null,
  loading: { stores: false, products: false },
  error: { stores: null, products: null },

  setStores: (stores) => set({ stores }),
  setProducts: (storeId, products) =>
    set((state) => ({
      productsByStore: { ...state.productsByStore, [storeId]: products },
    })),
  setProductsFromList: (products) =>
    set(() => ({
      productsByStore: products.reduce<Record<string, Product[]>>((acc, p) => {
        if (!acc[p.storeId]) acc[p.storeId] = [];
        acc[p.storeId].push(p);
        return acc;
      }, {}),
    })),
  setSelectedStoreId: (storeId) => set({ selectedStoreId: storeId }),
  setStoresLoading: (loading) =>
    set((state) => ({ loading: { ...state.loading, stores: loading } })),
  setProductsLoading: (loading) =>
    set((state) => ({ loading: { ...state.loading, products: loading } })),
  setStoresError: (error) =>
    set((state) => ({ error: { ...state.error, stores: error } })),
  setProductsError: (error) =>
    set((state) => ({ error: { ...state.error, products: error } })),

  addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
  updateStoreInState: (id, data) =>
    set((state) => ({
      stores: state.stores.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),
  removeStore: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.productsByStore;
      return {
        stores: state.stores.filter((s) => s.id !== id),
        productsByStore: rest,
        selectedStoreId:
          state.selectedStoreId === id ? null : state.selectedStoreId,
      };
    }),

  addProduct: (product) =>
    set((state) => {
      const list = state.productsByStore[product.storeId] ?? [];
      return {
        productsByStore: {
          ...state.productsByStore,
          [product.storeId]: [...list, product],
        },
      };
    }),
  updateProductInState: (id, data) =>
    set((state) => ({
      productsByStore: Object.fromEntries(
        Object.entries(state.productsByStore).map(([storeId, products]) => [
          storeId,
          products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        ])
      ),
    })),
  removeProduct: (storeId, productId) =>
    set((state) => ({
      productsByStore: {
        ...state.productsByStore,
        [storeId]: (state.productsByStore[storeId] ?? []).filter(
          (p) => p.id !== productId
        ),
      },
    })),
}));
