import React from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Badge, BadgeText } from '@/components/ui/badge';
import {
  Icon,
  EditIcon,
  TrashIcon,
  ChevronRightIcon,
} from '@/components/ui/icon';
import { Store } from 'lucide-react-native';
import type { Store as StoreType } from '@/lib/stores';

const cardClassName =
  'p-4 mb-4 md:mb-0 md:flex-1 md:min-w-0 md:max-w-[calc(50%-8px)] lg:max-w-[calc(33.333%-11px)] xl:max-w-[calc(25%-12px)]';

interface StoreCardProps {
  store: StoreType;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
}

export function StoreCard(props: StoreCardProps) {
  const { store, onEdit, onDelete, onSelect } = props;
  return (
    <Card variant="elevated" size="md" className={cardClassName}>
      <Box className="flex-1">
        <HStack className="justify-between items-start mb-2">
          <HStack className="items-center gap-2 flex-1 min-w-0">
            <Icon as={Store} size="sm" className="text-primary-500 shrink-0" />
            <Text
              className="font-semibold text-typography-900 text-base flex-1"
              numberOfLines={1}
            >
              {store.name}
            </Text>
          </HStack>
          <Badge action="info" variant="solid" size="sm">
            <BadgeText>{store.productCount ?? 0} produtos</BadgeText>
          </Badge>
        </HStack>
        <Text className="text-typography-600 text-sm mb-3" numberOfLines={2}>
          {store.address}
        </Text>
        <HStack className="gap-2 flex-wrap" space="sm">
          <Button
            size="sm"
            variant="outline"
            onPress={onSelect}
            action="primary"
          >
            <ButtonIcon as={ChevronRightIcon} />
            <ButtonText>Ver produtos</ButtonText>
          </Button>
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
