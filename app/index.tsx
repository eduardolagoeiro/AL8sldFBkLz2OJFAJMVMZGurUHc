import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';

export default function Index() {
  const router = useRouter();

  return (
    <Box className="flex-1 bg-background-100 items-center justify-center p-6">
      <VStack className="items-center gap-6 max-w-md">
        <Text className="text-2xl font-bold text-typography-900 text-center">
          Gestão de Lojas e Produtos
        </Text>
        <Text className="text-base text-typography-600 text-center">
          Gerencie suas lojas, cadastre produtos por categoria e mantenha tudo
          organizado em um só lugar.
        </Text>
        <Button onPress={() => router.replace('/(tabs)/stores')} size="lg">
          <ButtonText>Entrar no app</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
