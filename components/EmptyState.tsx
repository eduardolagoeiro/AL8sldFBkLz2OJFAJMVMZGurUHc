import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';

interface EmptyStateProps {
  message: string;
  icon?: React.ElementType;
}

export function EmptyState(props: EmptyStateProps) {
  const { message, icon: IconComponent } = props;
  return (
    <Box className="py-12 flex items-center justify-center">
      <VStack space="md" className="items-center">
        {IconComponent ? (
          <Icon as={IconComponent} size="xl" className="text-typography-400" />
        ) : null}
        <Text className="text-typography-500 text-center">{message}</Text>
      </VStack>
    </Box>
  );
}
