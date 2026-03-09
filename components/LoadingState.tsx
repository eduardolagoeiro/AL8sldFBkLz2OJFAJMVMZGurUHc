import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState(props: LoadingStateProps) {
  const { message = 'Carregando...' } = props;
  return (
    <Box className="py-12 flex items-center justify-center">
      <VStack space="md" className="items-center">
        <Spinner size="large" className="text-primary-500" />
        <Text className="text-typography-500">{message}</Text>
      </VStack>
    </Box>
  );
}
