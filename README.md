# Starter Kit Expo

## Estrutura do projeto

```
├── app/                    # Expo Router (rotas e layouts)
│   ├── (tabs)/             # Tabs: products, stores
│   ├── _layout.tsx
│   └── index.tsx
├── assets/
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Gluestack UI primitives
│   ├── ThemeToggle.tsx
│   ├── ErrorBanner.tsx
│   └── ...
├── constants/
├── hooks/
│   ├── products/           # Hooks de produtos
│   ├── stores/             # Hooks de lojas
│   └── ui/                 # useColorScheme, useClientOnlyValue
├── lib/                    # API, store, tipos, utils
│   ├── api/
│   ├── products/           # products API + types
│   ├── stores/             # stores API + types
│   ├── store/              # Zustand store
│   └── utils/
├── mocks/                  # MSW handlers e data
├── providers/              # Context providers (theme)
├── screens/                 # Telas por domínio
│   ├── products/
│   └── stores/
└── test-utils.tsx
```

## Tecnologias e versões

| Tecnologia            | Versão           |
| --------------------- | ---------------- |
| Node                  | 24.14.0 (Volta)  |
| Expo                  | ^54.0.7          |
| React                 | 19.1.0           |
| React Native          | 0.81.5           |
| TypeScript            | ~5.9.2           |
| Expo Router           | ~6.0.4           |
| NativeWind / Tailwind | ^4.2.1 / ^3.4.17 |
| Zustand               | ^5.0.11          |
| Zod                   | ^4.3.0           |
| MSW                   | 2.4.11           |
| Jest                  | ^29.2.1          |

## Instalação

```bash
yarn install
```

## Como rodar

```bash
yarn start
```

Porta 8082. O Mock (MSW) é habilitado automaticamente em dev.

```bash
yarn test        # testes (watch)
yarn test:ci     # testes (CI)
```
