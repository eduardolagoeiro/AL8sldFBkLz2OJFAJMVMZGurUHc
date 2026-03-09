import { useState, useMemo } from 'react';
import { useStores } from './use-stores';
import { useProducts } from './use-products';
import { useAppStore } from './store';
import type { Product } from './types';

export function useProductsScreen() {
  const { stores } = useStores();
  const selectedStoreId = useAppStore((s) => s.selectedStoreId);
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts(selectedStoreId);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    storeId: string;
  } | null>(null);

  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].filter(Boolean).sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery, categoryFilter]);

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setEditingProduct(null);
  }

  async function handleFormSubmit(payload: {
    storeId: string;
    name: string;
    category: string;
    price: number;
  }) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: payload.name,
        category: payload.category,
        price: payload.price,
      });
    } else {
      await createProduct(payload);
    }
    handleCloseForm();
  }

  function handleDeleteClick(product: Product) {
    setProductToDelete({ id: product.id, storeId: product.storeId });
  }

  function handleCloseDelete() {
    setProductToDelete(null);
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id, productToDelete.storeId);
    setProductToDelete(null);
  }

  const emptyMessage = searchQuery.trim()
    ? 'Nenhum produto encontrado.'
    : categoryFilter
      ? 'Nenhum produto nesta categoria.'
      : 'Nenhum produto cadastrado.';

  return {
    stores,
    products,
    loading,
    error,
    selectedStoreId,
    selectedStore,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    categories,
    formOpen,
    setFormOpen,
    editingProduct,
    productToDelete,
    emptyMessage,
    handleEdit,
    handleCloseForm,
    handleFormSubmit,
    handleDeleteClick,
    handleCloseDelete,
    handleConfirmDelete,
  };
}
