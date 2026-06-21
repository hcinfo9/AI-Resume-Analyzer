# Architectural Decisions

## ADR-001

Data: 09/06/2026

Decisão:
Utilizar Clean Architecture.

Motivação:
Separação de responsabilidades e escalabilidade.

---

## ADR-002

Data: 09/06/2026

Decisão:
Utilizar abstração para provedores de IA.

Motivação:
Permitir troca entre OpenAI, Gemini e Ollama sem impacto na regra de negócio.

---

## ADR-003

Data: 15/06/2026

Decisão:
Utilizar Next.js Fullstack (TypeScript) para unificar frontend e backend (Route Handlers).

Motivação:
Permite hospedagem 100% gratuita na Vercel no início, reduzindo a complexidade de múltiplos repositórios e barateando custos de servidores.

---

## ADR-004

Data: 15/06/2026

Decisão:
Utilizar a Gemini API (Google AI) como provedor principal de IA na V1.

Motivação:
Aproveitar a generosa camada gratuita de desenvolvedor do Google AI Studio para testes e produção inicial, economizando com chamadas de IA.

---

## ADR-005

Data: 15/06/2026

Decisão:
Utilizar Supabase (PostgreSQL) na camada gratuita para persistência.

Motivação:
Obter um banco de dados relacional estável e gratuito para registrar as análises feitas e gerenciar controle de abuso/limites sem custos iniciais.