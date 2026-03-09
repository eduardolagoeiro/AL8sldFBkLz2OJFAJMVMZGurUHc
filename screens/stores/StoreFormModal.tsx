import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import type { Store, CreateStoreInput } from '@/lib/types';

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateStoreInput) => Promise<void>;
  store?: Store | null;
}

export function StoreFormModal(props: StoreFormModalProps) {
  const { isOpen, onClose, onSubmit, store } = props;
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [nameError, setNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!store;

  useEffect(() => {
    if (isOpen) {
      setName(store?.name ?? '');
      setAddress(store?.address ?? '');
      setNameError('');
      setAddressError('');
    }
  }, [isOpen, store]);

  function validate() {
    let valid = true;
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      valid = false;
    } else {
      setNameError('');
    }
    if (!address.trim()) {
      setAddressError('Endereço é obrigatório');
      valid = false;
    } else {
      setAddressError('');
    }
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), address: address.trim() });
      onClose();
    } catch (e) {
      setNameError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop onPress={onClose} />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-semibold text-typography-900">
            {isEdit ? 'Editar loja' : 'Nova loja'}
          </Text>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <ModalBody>
          <Box className="gap-4">
            <FormControl isInvalid={!!nameError} isRequired>
              <FormControlLabel>
                <FormControlLabelText>Nome</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Nome da loja"
                  value={name}
                  onChangeText={(v) => {
                    setName(v);
                    if (nameError) setNameError('');
                  }}
                  autoCapitalize="words"
                />
              </Input>
              {nameError ? (
                <FormControlError>
                  <FormControlErrorText>{nameError}</FormControlErrorText>
                </FormControlError>
              ) : null}
            </FormControl>
            <FormControl isInvalid={!!addressError} isRequired>
              <FormControlLabel>
                <FormControlLabelText>Endereço</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Endereço completo"
                  value={address}
                  onChangeText={(v) => {
                    setAddress(v);
                    if (addressError) setAddressError('');
                  }}
                  autoCapitalize="words"
                />
              </Input>
              {addressError ? (
                <FormControlError>
                  <FormControlErrorText>{addressError}</FormControlErrorText>
                </FormControlError>
              ) : null}
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onPress={onClose} action="secondary">
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button onPress={handleSubmit} isDisabled={loading}>
            <ButtonText>
              {loading ? 'Salvando...' : isEdit ? 'Salvar' : 'Cadastrar'}
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
