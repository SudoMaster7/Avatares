# Avatares Educacionais - Guia de Desenvolvimento

Sistema de avatares inteligentes para educação interativa com conversação em múltiplos idiomas.

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL
- **IA**: OpenAI GPT-4, Deepgram (STT), ElevenLabs (TTS)
- **Autenticação**: NextAuth.js

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Chaves de API: OpenAI, Deepgram, ElevenLabs

## 🛠️ Instalação

1. Instale as dependências: `npm install`
2. Configure `.env.local` com suas chaves de API
3. Configure o banco: `psql avatares_educacionais < database/schema.sql`
4. Rode o projeto: `npm run dev`

## 📁 Estrutura

```
src/
├── app/              # App Router
├── components/       # Componentes React
├── lib/              # Utilitários
├── types/            # TypeScript types
└── services/         # APIs externas
```

## 🎯 MVP

- 3 avatares iniciais
- Conversação por voz
- 2 módulos (Inglês + História)
- Avaliação automática
- Dashboard professores
