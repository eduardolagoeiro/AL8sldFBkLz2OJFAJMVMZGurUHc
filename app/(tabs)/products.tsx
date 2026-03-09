import React from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { useProductsScreen } from '@/lib/use-products-screen';
import { ProductFormModal } from '@/components/ProductFormModal';
import { ProductCard } from '@/components/ProductCard';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorBanner } from '@/components/ErrorBanner';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { AddIcon, SearchIcon, ChevronDownIcon } from '@/components/ui/icon';
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
import { Package } from 'lucide-react-native';

export default function ProductsScreen() {
  const router = useRouter();
  const {
    stores,
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
  } = useProductsScreen();

  return (
    <Box className="flex-1 bg-background-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <Box className="p-4 md:p-6 lg:p-8 xl:p-10 lg:max-w-6xl xl:max-w-7xl lg:mx-auto">
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

          {error ? <ErrorBanner message={error} /> : null}

          {loading ? (
            <LoadingState message="Carregando produtos..." />
          ) : filteredProducts.length === 0 ? (
            <EmptyState message={emptyMessage} icon={Package} />
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

      <DeleteConfirmDialog
        isOpen={!!productToDelete}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Excluir produto"
        message="Tem certeza que deseja excluir este produto?"
      />
    </Box>
  );
}
