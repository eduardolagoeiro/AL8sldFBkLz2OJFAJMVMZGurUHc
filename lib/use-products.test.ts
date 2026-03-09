import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useAppStore } from './store';
import type { Product } from './types';

const mockFetchProducts = jest.fn();
const mockFetchAllProducts = jest.fn();
const mockCreateProductApi = jest.fn();
const mockUpdateProductApi = jest.fn();
const mockDeleteProductApi = jest.fn();

jest.mock('./products-api', () => ({
  fetchProducts: (...args: unknown[]) => mockFetchProducts(...args),
  fetchAllProducts: (...args: unknown[]) => mockFetchAllProducts(...args),
  createProduct: (...args: unknown[]) => mockCreateProductApi(...args),
  updateProduct: (...args: unknown[]) => mockUpdateProductApi(...args),
  deleteProduct: (...args: unknown[]) => mockDeleteProductApi(...args),
}));

import { useProducts } from './use-products';

describe('useProducts', () => {
  const mockProducts: Product[] = [
    {
      id: 'p1',
      storeId: 'store-1',
      name: 'Produto A',
      category: 'Cat',
      price: 10,
    },
    {
      id: 'p2',
      storeId: 'store-2',
      name: 'Produto B',
      category: 'Cat',
      price: 20,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchAllProducts.mockResolvedValue([...mockProducts]);
    mockFetchProducts.mockImplementation((storeId: string) =>
      Promise.resolve(mockProducts.filter((p) => p.storeId === storeId))
    );
  });

  it('com storeId null retorna todos os produtos agregados', async () => {
    const { result } = renderHook(() => useProducts(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('com storeId definido retorna apenas produtos da loja', async () => {
    const { result } = renderHook(() => useProducts('store-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].id).toBe('p1');
  });

  it('createProduct sem storeId lança erro', async () => {
    const { result } = renderHook(() => useProducts(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      result.current.createProduct({
        storeId: 'any',
        name: 'Produto',
        category: 'Cat',
        price: 10,
      })
    ).rejects.toThrow('Selecione uma loja');
    expect(mockCreateProductApi).not.toHaveBeenCalled();
  });

  it('createProduct com payload válido adiciona produto', async () => {
    const newProduct: Product = {
      id: 'p-new',
      storeId: 'store-1',
      name: 'Novo Produto',
      category: 'Categoria',
      price: 15.9,
    };
    mockCreateProductApi.mockResolvedValue(newProduct);

    useAppStore.setState({
      productsByStore: { 'store-1': [mockProducts[0]] },
    });

    const { result } = renderHook(() => useProducts('store-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let product: Product;
    await act(async () => {
      product = await result.current.createProduct({
        storeId: 'store-1',
        name: 'Novo Produto',
        category: 'Categoria',
        price: 15.9,
      });
    });

    expect(product!.name).toBe('Novo Produto');
    expect(product!.storeId).toBe('store-1');

    await waitFor(() => {
      expect(
        result.current.products.some((p) => p.name === 'Novo Produto')
      ).toBe(true);
    });
  });

  it('updateProduct atualiza produto', async () => {
    const updatedProduct = {
      ...mockProducts[0],
      name: 'Atualizado',
    };
    mockUpdateProductApi.mockResolvedValue(updatedProduct);

    useAppStore.setState({
      productsByStore: { 'store-1': [mockProducts[0]] },
    });

    const { result } = renderHook(() => useProducts('store-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateProduct('p1', {
        name: 'Atualizado',
        category: 'Cat',
        price: 12,
      });
    });

    expect(mockUpdateProductApi).toHaveBeenCalledWith(
      'p1',
      expect.objectContaining({ name: 'Atualizado' })
    );

    await waitFor(() => {
      expect(result.current.products.find((p) => p.id === 'p1')?.name).toBe(
        'Atualizado'
      );
    });
  });

  it('deleteProduct remove produto', async () => {
    mockDeleteProductApi.mockResolvedValue(undefined);

    useAppStore.setState({
      productsByStore: { 'store-1': [mockProducts[0]] },
    });

    const { result } = renderHook(() => useProducts('store-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteProduct('p1', 'store-1');
    });

    expect(mockDeleteProductApi).toHaveBeenCalledWith('p1');

    await waitFor(() => {
      expect(
        result.current.products.find((p) => p.id === 'p1')
      ).toBeUndefined();
    });
  });
});
