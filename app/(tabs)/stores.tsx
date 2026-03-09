import React, { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import { ScrollView } from '@/components/ui/scroll-view';
import { useStores, useAppStore } from '@/lib';
import { StoreFormModal } from '@/components/StoreFormModal';
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
  Icon,
  AddIcon,
  EditIcon,
  SearchIcon,
  TrashIcon,
} from '@/components/ui/icon';
import { Store } from 'lucide-react-native';
import type { Store as StoreType } from '@/lib/types';

function StoreCard(props: {
  store: StoreType;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
}) {
  const { store, onEdit, onDelete, onSelect } = props;
  return (
    <Card
      variant="elevated"
      size="md"
      className="p-4 mb-4 md:mb-0 md:flex-1 md:min-w-0 md:max-w-[calc(50%-8px)] lg:max-w-[calc(33.333%-11px)]"
    >
      <Box onTouchEnd={onSelect} className="flex-1">
        <HStack className="justify-between items-start mb-2">
          <HStack className="items-center gap-2 flex-1 min-w-0">
            <Icon as={Store} size="sm" className="text-primary-500 shrink-0" />
            <Text
              className="font-semibold text-typography-900 text-base flex-1"
              numberOfLines={1}
            >
              {store.name}
            </Text>
          </HStack>
          <Badge action="info" variant="solid" size="sm">
            <BadgeText>{store.productCount ?? 0} produtos</BadgeText>
          </Badge>
        </HStack>
        <Text className="text-typography-600 text-sm mb-3" numberOfLines={2}>
          {store.address}
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

export default function StoresScreen() {
  const router = useRouter();
  const { stores, loading, error, createStore, updateStore, deleteStore } =
    useStores();
  const setSelectedStoreId = useAppStore((s) => s.setSelectedStoreId);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);
  const [deleteStoreId, setDeleteStoreId] = useState<string | null>(null);

  const filteredStores = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    );
  }, [stores, searchQuery]);

  function handleEdit(store: StoreType) {
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

  function handleDeleteClick(store: StoreType) {
    setDeleteStoreId(store.id);
  }

  async function handleConfirmDelete() {
    if (!deleteStoreId) return;
    await deleteStore(deleteStoreId);
    setDeleteStoreId(null);
  }

  return (
    <Box className="flex-1 bg-background-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      >
        <Box className="p-4 md:p-6 lg:p-8 lg:max-w-6xl lg:mx-auto">
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

          {error ? (
            <Box className="mb-4 p-3 rounded-lg bg-background-error">
              <Text className="text-error-700">{error}</Text>
            </Box>
          ) : null}

          {loading ? (
            <Box className="py-12">
              <Text className="text-typography-500 text-center">
                Carregando lojas...
              </Text>
            </Box>
          ) : filteredStores.length === 0 ? (
            <Box className="py-12">
              <Text className="text-typography-500 text-center">
                {searchQuery.trim()
                  ? 'Nenhuma loja encontrada.'
                  : 'Nenhuma loja cadastrada.'}
              </Text>
            </Box>
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

      <AlertDialog
        isOpen={!!deleteStoreId}
        onClose={() => setDeleteStoreId(null)}
      >
        <AlertDialogBackdrop onPress={() => setDeleteStoreId(null)} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="font-semibold text-typography-900">
              Excluir loja
            </Text>
            <AlertDialogCloseButton onPress={() => setDeleteStoreId(null)} />
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-typography-600">
              Tem certeza que deseja excluir esta loja? Os produtos vinculados
              também serão removidos.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onPress={() => setDeleteStoreId(null)}
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
