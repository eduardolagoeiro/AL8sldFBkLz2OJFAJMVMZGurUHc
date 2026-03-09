import React from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
}

export function DeleteConfirmDialog(props: DeleteConfirmDialogProps) {
  const { isOpen, onClose, onConfirm, title, message } = props;
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop onPress={onClose} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Text className="font-semibold text-typography-900">{title}</Text>
          <AlertDialogCloseButton onPress={onClose} />
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-typography-600">{message}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant="outline" onPress={onClose} action="secondary">
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button action="negative" onPress={onConfirm}>
            <ButtonText>Excluir</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
