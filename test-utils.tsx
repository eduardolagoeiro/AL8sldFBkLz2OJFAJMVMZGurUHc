import React from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export function AllTheProviders(props: { children: React.ReactNode }) {
  return (
    <GluestackUIProvider mode="dark">{props.children}</GluestackUIProvider>
  );
}
