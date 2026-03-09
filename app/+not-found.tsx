import React from 'react';
import { Link, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Center } from '@/components/ui/center';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Center className="flex-1">
        <Text className="text-secondary-200">{`Página não encontrada.`}</Text>
        <Link href="/" style={{ marginTop: 10 }}>
          <Text className="text-primary-500">Voltar ao início</Text>
        </Link>
      </Center>
    </>
  );
}
