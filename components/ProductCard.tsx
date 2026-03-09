import React from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Icon, EditIcon, TrashIcon } from '@/components/ui/icon';
import { Package } from 'lucide-react-native';
import type { Product as ProductType } from '@/lib/types';

const cardClassName =
  'p-4 mb-4 md:mb-0 md:flex-1 md:min-w-0 md:max-w-[calc(50%-8px)] lg:max-w-[calc(33.333%-11px)] xl:max-w-[calc(25%-12px)]';

interface ProductCardProps {
  product: ProductType;
  storeName?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductCard(props: ProductCardProps) {
  const { product, storeName, onEdit, onDelete } = props;
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);
  return (
    <Card variant="elevated" size="md" className={cardClassName}>
      <Box className="flex-1">
        <HStack className="items-center gap-2 mb-2">
          <Icon as={Package} size="sm" className="text-primary-500 shrink-0" />
          <Text
            className="font-semibold text-typography-900 text-base flex-1"
            numberOfLines={1}
          >
            {product.name}
          </Text>
        </HStack>
        <Text className="text-typography-600 text-sm mb-1">
          {product.category}
          {storeName ? ` • ${storeName}` : ''}
        </Text>
        <Text className="text-typography-900 font-medium text-lg mb-3">
          {priceFormatted}
        </Text>
        <HStack className="gap-2" space="sm">
          <Button
            size="sm"
            variant="outline"
            onPress={onEdit}
            action="secondary"
          >
            <ButtonIcon as={EditIcon} />
            <ButtonText>Editar</ButtonText>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={onDelete}
            action="negative"
          >
            <ButtonIcon as={TrashIcon} />
            <ButtonText>Excluir</ButtonText>
          </Button>
        </HStack>
      </Box>
    </Card>
  );
}
