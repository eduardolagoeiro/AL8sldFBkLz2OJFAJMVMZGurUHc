import { Button, ButtonIcon } from '@/components/ui/button';
import { MoonIcon, SunIcon, SlashIcon } from '@/components/ui/icon';
import { useTheme } from '@/providers';

export function ThemeToggle() {
  const { mode, effectiveColorScheme, toggleTheme } = useTheme();

  const Icon =
    mode === 'system'
      ? SlashIcon
      : effectiveColorScheme === 'dark'
        ? MoonIcon
        : SunIcon;

  return (
    <Button
      variant="outline"
      size="sm"
      action="secondary"
      onPress={toggleTheme}
    >
      <ButtonIcon as={Icon} size="sm" />
    </Button>
  );
}
