import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon, SlashIcon } from '@/components/ui/icon';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

async function enableMocking() {
  if (!__DEV__) return;
  await import('../msw.polyfills');
  const { server } = await import('../mocks/server');
  if (server?.listen) server.listen();
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [mswReady, setMswReady] = useState(!__DEV__);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    enableMocking().then(() => setMswReady(true));
  }, []);

  useEffect(() => {
    if (loaded && mswReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, mswReady]);

  if (!mswReady) return null;
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const pathname = usePathname();
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<'system' | 'light' | 'dark'>('system');

  // Determine effective color scheme
  const effectiveColorScheme =
    mode === 'system' ? (systemColorScheme ?? 'light') : mode;

  const handleToggleTheme = () => {
    if (mode === 'system') {
      setMode('light');
    } else if (mode === 'light') {
      setMode('dark');
    } else {
      setMode('system');
    }
  };

  return (
    <GluestackUIProvider mode={mode}>
      <ThemeProvider
        value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Slot />
        {pathname === '/' && (
          <Fab onPress={handleToggleTheme} className="m-6" size="lg">
            <FabIcon
              as={
                mode === 'system'
                  ? SlashIcon
                  : effectiveColorScheme === 'dark'
                    ? MoonIcon
                    : SunIcon
              }
            />
          </Fab>
        )}
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
