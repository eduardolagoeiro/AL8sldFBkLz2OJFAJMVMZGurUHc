import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { Store } from '@/lib/stores';

const mockStores: Store[] = [
  {
    id: 'store-1',
    name: 'Loja Central',
    address: 'Rua das Flores, 123',
  },
];

const mockFetchStores = jest.fn();
const mockCreateStoreApi = jest.fn();
const mockUpdateStoreApi = jest.fn();
const mockDeleteStoreApi = jest.fn();

jest.mock('@/lib/stores', () => ({
  ...jest.requireActual('@/lib/stores'),
  fetchStores: (...args: unknown[]) => mockFetchStores(...args),
  createStore: (...args: unknown[]) => mockCreateStoreApi(...args),
  updateStore: (...args: unknown[]) => mockUpdateStoreApi(...args),
  deleteStore: (...args: unknown[]) => mockDeleteStoreApi(...args),
}));

import { useStores } from './use-stores';

describe('useStores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchStores.mockResolvedValue([...mockStores]);
  });

  it('carrega lojas no refetch', async () => {
    const { result } = renderHook(() => useStores());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.stores).toHaveLength(1);
    expect(result.current.stores[0].name).toBe('Loja Central');
    expect(result.current.error).toBeNull();
  });

  it('createStore adiciona loja', async () => {
    const newStore: Store = {
      id: 'store-new',
      name: 'Loja Teste',
      address: 'Rua Teste, 999',
    };
    mockCreateStoreApi.mockResolvedValue(newStore);

    const { result } = renderHook(() => useStores());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let store: Store;
    await act(async () => {
      store = await result.current.createStore({
        name: 'Loja Teste',
        address: 'Rua Teste, 999',
      });
    });

    expect(store!.name).toBe('Loja Teste');
    expect(mockCreateStoreApi).toHaveBeenCalledWith({
      name: 'Loja Teste',
      address: 'Rua Teste, 999',
    });

    await waitFor(() => {
      expect(result.current.stores.some((s) => s.name === 'Loja Teste')).toBe(
        true
      );
    });
  });

  it('updateStore atualiza loja existente', async () => {
    const updatedStore = {
      ...mockStores[0],
      name: 'Nome Atualizado',
    };
    mockUpdateStoreApi.mockResolvedValue(updatedStore);

    const { result } = renderHook(() => useStores());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updated: Store;
    await act(async () => {
      updated = await result.current.updateStore('store-1', {
        name: 'Nome Atualizado',
        address: mockStores[0].address,
      });
    });

    expect(updated!.name).toBe('Nome Atualizado');
    expect(mockUpdateStoreApi).toHaveBeenCalledWith(
      'store-1',
      expect.objectContaining({ name: 'Nome Atualizado' })
    );

    await waitFor(() => {
      expect(result.current.stores.find((s) => s.id === 'store-1')?.name).toBe(
        'Nome Atualizado'
      );
    });
  });

  it('deleteStore remove loja', async () => {
    mockDeleteStoreApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useStores());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const countBefore = result.current.stores.length;
    await act(async () => {
      await result.current.deleteStore('store-1');
    });

    expect(mockDeleteStoreApi).toHaveBeenCalledWith('store-1');

    await waitFor(() => {
      expect(result.current.stores.length).toBe(countBefore - 1);
      expect(
        result.current.stores.find((s) => s.id === 'store-1')
      ).toBeUndefined();
    });
  });

  it('createStore com payload inválido lança erro', async () => {
    const { result } = renderHook(() => useStores());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.createStore({ name: '', address: '' })
    ).rejects.toThrow(/obrigatório/);
    expect(mockCreateStoreApi).not.toHaveBeenCalled();
  });
});
