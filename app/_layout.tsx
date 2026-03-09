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
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from '@/lib/theme-context';

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
  return (
    <AppThemeProvider>
      <RootLayoutNav />
    </AppThemeProvider>
  );
}

function RootLayoutNav() {
  const { mode, effectiveColorScheme } = useTheme();

  return (
    <GluestackUIProvider mode={mode}>
      <ThemeProvider
        value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Slot />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
