import React from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { useAppStore } from '@/lib';
import { useStoresScreen } from '@/lib/use-stores-screen';
import { StoreFormModal } from '@/components/StoreFormModal';
import { StoreCard } from '@/components/StoreCard';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorBanner } from '@/components/ErrorBanner';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { AddIcon, SearchIcon } from '@/components/ui/icon';
import { Store } from 'lucide-react-native';

export default function StoresScreen() {
  const router = useRouter();
  const setSelectedStoreId = useAppStore((s) => s.setSelectedStoreId);
  const {
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
  } = useStoresScreen();

  return (
    <Box className="flex-1 bg-background-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <Box className="p-4 md:p-6 lg:p-8 xl:p-10 lg:max-w-6xl xl:max-w-7xl lg:mx-auto">
          <HStack className="justify-between items-center mb-4 md:mb-6 flex-wrap gap-4">
            <Text className="text-xl md:text-2xl font-bold text-typography-900">
              Lojas
            </Text>
            <Button onPress={() => setFormOpen(true)} size="md">
              <ButtonIcon as={AddIcon} />
              <ButtonText>Nova loja</ButtonText>
            </Button>
          </HStack>

          <Box className="mb-4 md:mb-6">
            <Input variant="outline" size="md" className="max-w-md">
              <InputIcon as={SearchIcon} className="text-typography-500" />
              <InputField
                placeholder="Buscar por nome ou endereço..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </Box>

          {error ? <ErrorBanner message={error} /> : null}

          {loading ? (
            <LoadingState message="Carregando lojas..." />
          ) : filteredStores.length === 0 ? (
            <EmptyState message={emptyMessage} icon={Store} />
          ) : (
            <Box className="flex flex-col md:flex-row md:flex-wrap md:gap-4">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onEdit={() => handleEdit(store)}
                  onDelete={() => handleDeleteClick(store)}
                  onSelect={() => {
                    setSelectedStoreId(store.id);
                    router.push('/(tabs)/products');
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </ScrollView>

      <StoreFormModal
        isOpen={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        store={editingStore}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteStoreId}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Excluir loja"
        message="Tem certeza que deseja excluir esta loja? Os produtos vinculados também serão removidos."
      />
    </Box>
  );
}
