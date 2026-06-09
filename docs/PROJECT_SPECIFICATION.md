# AI Resume Analyzer

## Visão Geral

O AI Resume Analyzer é uma aplicação web que utiliza Inteligência Artificial para analisar currículos em formato PDF e fornecer feedback estruturado ao usuário.

O objetivo é ajudar profissionais a identificar pontos fortes, pontos de melhoria e oportunidades de otimização em seus currículos.

---

# Objetivo

Permitir que qualquer usuário envie um currículo e receba uma análise automática baseada em Inteligência Artificial em poucos segundos.

---

# Problema

Muitas pessoas enviam currículos para processos seletivos sem saber:

- Se o currículo está bem estruturado;
- Se as informações estão claras;
- Quais pontos podem ser melhorados;
- Se existem informações faltando.

Atualmente esse processo depende de revisão humana ou consultorias especializadas.

---

# Solução

A aplicação realizará:

1. Upload do currículo em PDF;
2. Extração do conteúdo textual;
3. Envio para um modelo de IA;
4. Geração de feedback estruturado;
5. Exibição do resultado ao usuário.

---

# Escopo da V1

## Funcionalidades

### Upload de currículo

O usuário poderá enviar um arquivo PDF.

---

### Extração de texto

O sistema deverá extrair o conteúdo textual do PDF.

---

### Análise com IA

O conteúdo será enviado para um provedor de IA.

---

### Resultado da análise

O sistema deverá retornar:

- Nota geral;
- Pontos fortes;
- Pontos de melhoria;
- Sugestões de otimização.

---

# Fora do Escopo da V1

Não será desenvolvido inicialmente:

- Login;
- Cadastro;
- Histórico;
- Dashboard;
- Pagamentos;
- Comparação com vagas;
- Compartilhamento;
- Exportação.

---

# Regras de Negócio

## RN001

Somente arquivos PDF serão aceitos.

---

## RN002

O tamanho máximo do arquivo será definido posteriormente.

---

## RN003

O currículo deverá possuir conteúdo textual legível.

---

## RN004

A IA deverá retornar feedback estruturado.

---

## RN005

O sistema não substitui recrutadores humanos.

---

# Arquitetura

Será utilizada Clean Architecture.

Camadas:

- API
- Application
- Domain
- Infrastructure

Princípios:

- SOLID
- Clean Code
- Separation of Concerns
- Dependency Injection

---

# Stack Tecnológica

## Backend

- ASP.NET Core
- C#
- Entity Framework Core

## Banco de Dados

- PostgreSQL

## Frontend

- Next.js
- TypeScript
- TailwindCSS

## IA

- OpenAI

## Containers

- Docker
- Docker Compose

---

# Integrações Externas

## OpenAI

Responsável pela análise do currículo.

A integração será realizada através de abstração utilizando interface.

Exemplo:

IAProvider
├── OpenAIProvider
├── GeminiProvider
└── OllamaProvider

---

# Objetivos Técnicos

O projeto deverá demonstrar:

- Clean Architecture;
- SOLID;
- Integração com IA;
- Docker;
- APIs REST;
- Boas práticas de documentação;
- Escalabilidade futura.

---

# Roadmap

## V1

- Upload PDF
- Extração de texto
- Análise IA
- Exibição do resultado

## V2

- Comparação com vaga
- Score por categoria
- Histórico

## V3

- Dashboard
- Login
- Plano Premium