export const useRouter = () => ({
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  setParams: jest.fn(),
});

export const usePathname = () => '/';
export const useSegments = () => [];
export const useLocalSearchParams = () => ({});
