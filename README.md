# Eleição 2026 no Exterior

Dashboard em Next.js para analisar como votaram os brasileiros no exterior nas eleições presidenciais de 2026.

## O que oferece

- filtro por país e região
- mapa mundial interativo com marcadores por localidade
- comparação entre os dois campos de votação
- visão geral de votos, percentual e ranking por país
- integração com PostgreSQL via Prisma

## Tecnologias

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Recharts
- react-simple-maps

## Pré-requisitos

- Node.js 20+
- Docker
- npm

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o banco PostgreSQL:

```bash
npm run db:start
```

3. Gere o cliente Prisma e popule os dados:

```bash
npx prisma generate
npm run db:seed
```

4. Inicie o projeto:

```bash
npm run dev
```

Acesse: http://localhost:3000

## Scripts úteis

```bash
npm run dev
npm run build
npm run start
npm run db:start
npm run db:seed
```

## Observação

Os dados exibidos são uma base compilada e parcial, reunida para análise visual e comparativa do comportamento dos brasileiros no exterior.
