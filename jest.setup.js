import { act } from '@testing-library/react-native';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { resetDb } from './mocks/data';
import { useAppStore } from './lib/store';

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  server.resetHandlers();
  resetDb();
  act(() => {
    useAppStore.setState({
      stores: [],
      productsByStore: {},
      selectedStoreId: null,
      loading: { stores: false, products: false },
      error: { stores: null, products: null },
    });
  });
});

afterAll(() => {
  server.close();
});
