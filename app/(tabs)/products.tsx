import React, { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { useStores, useProducts, useAppStore } from '@/lib';
import { ProductFormModal } from '@/components/ProductFormModal';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  SelectScrollView,
} from '@/components/ui/select';
import {
  AddIcon,
  EditIcon,
  SearchIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@/components/ui/icon';
import { Package } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import type { Product as ProductType } from '@/lib/types';

function ProductCard(props: {
  product: ProductType;
  storeName?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { product, storeName, onEdit, onDelete } = props;
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);
  return (
    <Card
      variant="elevated"
      size="md"
      className="p-4 mb-4 md:mb-0 md:flex-1 md:min-w-0 md:max-w-[calc(50%-8px)] lg:max-w-[calc(33.333%-11px)]"
    >
      <Box className="flex-1">
        <HStack className="items-center gap-2 mb-2">
          <Icon as={Package} size="sm" className="text-primary-500 shrink-0" />
          <Text
            className="font-semibold text-typography-900 text-base flex-1"
            numberOfLines={1}
          >
            {product.name}
          </Text>
        </HStack>
        <Text className="text-typography-600 text-sm mb-1">
          {product.category}
          {storeName ? ` • ${storeName}` : ''}
        </Text>
        <Text className="text-typography-900 font-medium text-lg mb-3">
          {priceFormatted}
        </Text>
        <HStack className="gap-2" space="sm">
          <Button
            size="sm"
            variant="outline"
            onPress={onEdit}
            action="secondary"
          >
            <ButtonIcon as={EditIcon} />
            <ButtonText>Editar</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={onDelete}
            action="negative"
          >
            <ButtonIcon as={TrashIcon} />
            <ButtonText>Excluir</ButtonText>
          </Button>
        </HStack>
      </Box>
    </Card>
  );
}

export default function ProductsScreen() {
  const router = useRouter();
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
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const selectedStore = stores.find((s) => s.id === selectedStoreId);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

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

  function handleEdit(product: ProductType) {
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

  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    storeId: string;
  } | null>(null);

  function handleDeleteClick(product: ProductType) {
    setProductToDelete({ id: product.id, storeId: product.storeId });
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;
    await deleteProduct(productToDelete.id, productToDelete.storeId);
    setProductToDelete(null);
  }

  return (
    <Box className="flex-1 bg-background-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <Box className="p-4 md:p-6 lg:p-8 lg:max-w-6xl lg:mx-auto">
          <HStack className="justify-between items-center mb-4 md:mb-6 flex-wrap gap-4">
            <Box className="flex-1 min-w-0">
              <Text className="text-xl md:text-2xl font-bold text-typography-900">
                Produtos
              </Text>
              <Text className="text-typography-600 text-sm mt-1">
                {selectedStore
                  ? `Loja: ${selectedStore.name}`
                  : 'Todos os produtos'}
              </Text>
            </Box>
            <HStack className="gap-2" space="sm">
              <Button
                variant="outline"
                onPress={() => router.push('/(tabs)/stores')}
                action="secondary"
                size="sm"
              >
                <ButtonText>
                  {selectedStore
                    ? 'Trocar loja'
                    : 'Selecionar loja para filtrar'}
                </ButtonText>
              </Button>
              {selectedStoreId ? (
                <Button onPress={() => setFormOpen(true)} size="md">
                  <ButtonIcon as={AddIcon} />
                  <ButtonText>Novo produto</ButtonText>
                </Button>
              ) : null}
            </HStack>
          </HStack>

          <Box className="mb-4 md:mb-6 gap-4">
            <HStack className="gap-4 flex-wrap">
              <Input
                variant="outline"
                size="md"
                className="flex-1 min-w-[200px]"
              >
                <InputIcon as={SearchIcon} className="text-typography-500" />
                <InputField
                  placeholder="Buscar por nome ou categoria..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </Input>
              <Select
                selectedValue={categoryFilter ?? ''}
                onValueChange={(v) => setCategoryFilter(v || null)}
                className="w-[200px]"
              >
                <SelectTrigger>
                  <SelectInput placeholder="Filtrar por categoria" />
                  <SelectIcon as={ChevronDownIcon} className="mr-3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent className="max-h-48">
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectScrollView>
                      <SelectItem label="Todas" value="" />
                      {categories.map((cat) => (
                        <SelectItem key={cat} label={cat} value={cat} />
                      ))}
                    </SelectScrollView>
                  </SelectContent>
                </SelectPortal>
              </Select>
            </HStack>
          </Box>

          {error ? (
            <Box className="mb-4 p-3 rounded-lg bg-background-error">
              <Text className="text-error-700">{error}</Text>
            </Box>
          ) : null}

          {loading ? (
            <Box className="py-12">
              <Text className="text-typography-500 text-center">
                Carregando produtos...
              </Text>
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Box className="py-12">
              <Text className="text-typography-500 text-center">
                {searchQuery.trim()
                  ? 'Nenhum produto encontrado.'
                  : categoryFilter
                    ? 'Nenhum produto nesta categoria.'
                    : 'Nenhum produto cadastrado.'}
              </Text>
            </Box>
          ) : (
            <Box className="flex flex-col md:flex-row md:flex-wrap md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  storeName={
                    !selectedStoreId
                      ? stores.find((s) => s.id === product.storeId)?.name
                      : undefined
                  }
                  onEdit={() => handleEdit(product)}
                  onDelete={() => handleDeleteClick(product)}
                />
              ))}
            </Box>
          )}
        </Box>
      </ScrollView>

      <ProductFormModal
        isOpen={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        storeId={selectedStoreId ?? editingProduct?.storeId ?? ''}
        categories={categories}
      />

      <AlertDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
      >
        <AlertDialogBackdrop onPress={() => setProductToDelete(null)} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="font-semibold text-typography-900">
              Excluir produto
            </Text>
            <AlertDialogCloseButton onPress={() => setProductToDelete(null)} />
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-typography-600">
              Tem certeza que deseja excluir este produto?
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={() => setProductToDelete(null)}
              action="secondary"
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button action="negative" onPress={handleConfirmDelete}>
              <ButtonText>Excluir</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
