import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  SelectScrollView,
} from '@/components/ui/select';
import { Input, InputField } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ChevronDownIcon } from '@/components/ui/icon';

const NEW_CATEGORY_VALUE = '__new__';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  placeholder?: string;
  onNewCategoryRequest?: () => void;
}

export function CategorySelect(props: CategorySelectProps) {
  const {
    value,
    onChange,
    categories,
    placeholder = 'Selecione ou digite',
    onNewCategoryRequest,
  } = props;

  const [showNewInput, setShowNewInput] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState('');

  const sortedCategories = useMemo(() => {
    const set = new Set(categories);
    if (value.trim() && !set.has(value)) set.add(value);
    return [...set].filter(Boolean).sort();
  }, [categories, value]);

  function handleValueChange(v: string) {
    if (v === NEW_CATEGORY_VALUE) {
      setShowNewInput(true);
      setNewCategoryText('');
      onNewCategoryRequest?.();
    } else {
      setShowNewInput(false);
      onChange(v);
    }
  }

  function handleNewCategoryChange(text: string) {
    setNewCategoryText(text);
    onChange(text.trim());
  }

  function handleBackToList() {
    setShowNewInput(false);
    setNewCategoryText('');
    onChange('');
  }

  if (showNewInput) {
    return (
      <Box className="gap-2">
        <Input>
          <InputField
            placeholder="Nome da nova categoria"
            value={newCategoryText}
            onChangeText={handleNewCategoryChange}
            autoCapitalize="words"
            autoFocus
          />
        </Input>
        <Text
          onPress={handleBackToList}
          className="text-sm text-primary-600 py-1"
        >
          Escolher da lista
        </Text>
      </Box>
    );
  }

  return (
    <Select selectedValue={value} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectInput placeholder={placeholder} />
        <SelectIcon as={ChevronDownIcon} className="mr-3" />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent className="max-h-64">
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          <SelectScrollView>
            {sortedCategories.map((cat) => (
              <SelectItem key={cat} label={cat} value={cat} />
            ))}
            <SelectItem
              label="+ Nova categoria..."
              value={NEW_CATEGORY_VALUE}
            />
          </SelectScrollView>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
