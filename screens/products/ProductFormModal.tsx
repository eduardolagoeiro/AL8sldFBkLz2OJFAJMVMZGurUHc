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
import { CategorySelect } from './CategorySelect';
import type { Product, CreateProductInput } from '@/lib/types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProductInput) => Promise<void>;
  product?: Product | null;
  storeId: string;
  categories?: string[];
}

export function ProductFormModal(props: ProductFormModalProps) {
  const {
    isOpen,
    onClose,
    onSubmit,
    product,
    storeId,
    categories = [],
  } = props;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [nameError, setNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = !!product;

  useEffect(() => {
    if (isOpen) {
      setName(product?.name ?? '');
      setCategory(product?.category ?? '');
      setPriceStr(product?.price != null ? String(product.price) : '');
      setNameError('');
      setCategoryError('');
      setPriceError('');
    }
  }, [isOpen, product]);

  function validate() {
    let valid = true;
    if (!name.trim()) {
      setNameError('Nome é obrigatório');
      valid = false;
    } else {
      setNameError('');
    }
    if (!category.trim()) {
      setCategoryError('Categoria é obrigatória');
      valid = false;
    } else {
      setCategoryError('');
    }
    const priceNum = parseFloat(priceStr.replace(',', '.'));
    if (priceStr.trim() === '' || isNaN(priceNum) || priceNum < 0) {
      setPriceError('Preço deve ser um número positivo');
      valid = false;
    } else {
      setPriceError('');
    }
    return valid;
  }

  async function handleSubmit() {
    if (!validate()) return;
    const priceNum = parseFloat(priceStr.replace(',', '.'));
    setLoading(true);
    try {
      await onSubmit({
        storeId,
        name: name.trim(),
        category: category.trim(),
        price: priceNum,
      });
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
            {isEdit ? 'Editar produto' : 'Novo produto'}
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
                  placeholder="Nome do produto"
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
            <FormControl isInvalid={!!categoryError} isRequired>
              <FormControlLabel>
                <FormControlLabelText>Categoria</FormControlLabelText>
              </FormControlLabel>
              <CategorySelect
                value={category}
                onChange={(v) => {
                  setCategory(v);
                  if (categoryError) setCategoryError('');
                }}
                categories={categories}
                placeholder="Selecione ou crie uma categoria"
              />
              {categoryError ? (
                <FormControlError>
                  <FormControlErrorText>{categoryError}</FormControlErrorText>
                </FormControlError>
              ) : null}
            </FormControl>
            <FormControl isInvalid={!!priceError} isRequired>
              <FormControlLabel>
                <FormControlLabelText>Preço</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="0,00"
                  value={priceStr}
                  onChangeText={(v) => {
                    setPriceStr(v);
                    if (priceError) setPriceError('');
                  }}
                  keyboardType="decimal-pad"
                />
              </Input>
              {priceError ? (
                <FormControlError>
                  <FormControlErrorText>{priceError}</FormControlErrorText>
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
