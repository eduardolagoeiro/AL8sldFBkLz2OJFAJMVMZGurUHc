import { useState, useMemo } from 'react';
import { useStores } from './use-stores';
import { useAppStore } from '@/lib/store';
import type { Store } from '@/lib/stores';

export function useStoresScreen() {
  const { stores, loading, error, createStore, updateStore, deleteStore } =
    useStores();
  const productsByStore = useAppStore((s) => s.productsByStore);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deleteStoreId, setDeleteStoreId] = useState<string | null>(null);

  const filteredStores = useMemo(() => {
    const withLiveCount = stores.map((s) => ({
      ...s,
      productCount: productsByStore[s.id]?.length ?? s.productCount ?? 0,
    }));
    const q = searchQuery.trim().toLowerCase();
    if (!q) return withLiveCount;
    return withLiveCount.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    );
  }, [stores, productsByStore, searchQuery]);

  function handleEdit(store: Store) {
    setEditingStore(store);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingStore(null);
  }

  async function handleFormSubmit(payload: { name: string; address: string }) {
    if (editingStore) {
      await updateStore(editingStore.id, payload);
    } else {
      await createStore(payload);
    }
    handleCloseForm();
  }

  function handleDeleteClick(store: Store) {
    setDeleteStoreId(store.id);
  }

  function handleCloseDelete() {
    setDeleteStoreId(null);
  }

  async function handleConfirmDelete() {
    if (!deleteStoreId) return;
    await deleteStore(deleteStoreId);
    setDeleteStoreId(null);
  }

  const emptyMessage = searchQuery.trim()
    ? 'Nenhuma loja encontrada.'
    : 'Nenhuma loja cadastrada.';

  return {
    stores,
    loading,
    error,
    filteredStores,
    searchQuery,
    setSearchQuery,
    formOpen,
    setFormOpen,
    editingStore,
    deleteStoreId,
    emptyMessage,
    handleEdit,
    handleCloseForm,
    handleFormSubmit,
    handleDeleteClick,
    handleCloseDelete,
    handleConfirmDelete,
  };
}
