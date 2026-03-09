import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner(props: ErrorBannerProps) {
  const { message } = props;
  return (
    <Box className="mb-4 p-3 rounded-lg bg-background-error">
      <Text className="text-error-700">{message}</Text>
    </Box>
  );
}
