# Vila do Saber — Avatares Educacionais 🎓

> Converse com Einstein, Marie Curie, Dom Pedro II e muito mais. Aprendizado imersivo com IA generativa.

---

## O que é

A **Vila do Saber** é uma plataforma de educação interativa onde alunos conversam com avatares históricos e educacionais movidos por inteligência artificial. Cada personagem tem personalidade, voz e estilo pedagógico próprios — transformando o estudo em uma experiência memorável.

## Funcionalidades

- **19 avatares** — figuras históricas (Tesla, Marie Curie, Dom Pedro II, Santos Dumont) e professores temáticos (Matemática, Inglês, Ciências, Português e mais)
- **Conversa por texto e voz** — gravação de áudio com transcrição, resposta falada com voz ElevenLabs (Pro) ou Lemonfox (Grátis)
- **Minigames educativos** — quizzes, drag & drop, verdade ou mentira, preenchimento de lacunas, por disciplina
- **Sistema de gamificação** — XP, medalhas, streaks e ranking da comunidade
- **Criação de avatares personalizados** — crie um mentor a partir de qualquer nome ou referência (Pro)
- **Cenários pedagógicos** — contextos de aprendizado com objetivos definidos por disciplina e dificuldade
- **Painel do aluno** — histórico de conversas, progresso por matéria, conquistas
- **Painel admin** — gestão de usuários, cupons, métricas e analytics de conversão

## Planos

| | Grátis | Pro (R$ 29,90/mês) |
|---|---|---|
| Personagens | 3 | 19+ |
| Tokens/dia | 50 | Ilimitado |
| Qualidade da IA | Básica | Avançada (llama-3.3-70b) |
| Voz | Lemonfox | ElevenLabs Premium |
| Minigames | Básicos | Completos |
| Criar avatar | ❌ | ✅ |
| Relatórios pais | ❌ | ✅ |

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind CSS v4, Framer Motion, Radix UI, shadcn/ui |
| Auth & DB | Supabase (PostgreSQL + Auth) |
| IA / LLM | Groq (llama-3.1-8b / llama-3.3-70b) |
| TTS | ElevenLabs (Pro), Lemonfox (Grátis) |
| STT | Deepgram / Whisper |
| Pagamentos | Stripe (checkout + webhooks + portal) |
| Cache | Upstash Redis |
| Deploy | Vercel (região gru1 — São Paulo) |

---

## Configuração Local

**1. Clonar e instalar**

```bash
git clone <repo-url>
cd avatares-educacionais
npm install
```

**2. Criar `.env.local`** na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# IA
GROQ_API_KEY=
GEMINI_API_KEY=

# Voz
ELEVENLABS_API_KEY=
LEMONFOX_API_KEY=
DEEPGRAM_API_KEY=

# Pagamentos
STRIPE_SECRET_KEY=           # sk_test_... ou sk_live_...
STRIPE_WEBHOOK_SECRET=       # whsec_... (Stripe Dashboard → Webhooks → Signing secret)
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=   # price_... (não prod_...)
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=    # price_...

# Cache
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**3. Rodar**

```bash
npm run dev
# Acesse http://localhost:3000
```

---

## Banco de Dados (Supabase)

O schema base está em [`database/schema.sql`](database/schema.sql).

Execute também as seguintes tabelas no **Supabase SQL Editor**:

```sql
-- Cupons de desconto (painel admin)
CREATE TABLE IF NOT EXISTS coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_pct integer NOT NULL,
  max_uses integer,
  uses_count integer DEFAULT 0,
  expires_at timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Idempotência de eventos Stripe
CREATE TABLE IF NOT EXISTS payment_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id text UNIQUE NOT NULL,
  event_type text,
  payload jsonb,
  processed boolean DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Assinaturas Stripe
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  stripe_price_id text,
  plan text DEFAULT 'free',
  status text,
  billing_interval text DEFAULT 'month',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Colunas extras na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_tokens_used integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_tokens_reset date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_messages_sent integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Trigger: sincroniza users.plan quando subscription muda
CREATE OR REPLACE FUNCTION sync_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET plan = NEW.plan WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_user_plan_trigger ON subscriptions;
CREATE TRIGGER sync_user_plan_trigger
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION sync_user_plan();
```

---

## Deploy (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy para produção
vercel --prod
```

Configure todas as variáveis de ambiente em **Vercel → Settings → Environment Variables** antes do primeiro deploy. Lembre-se de atualizar `NEXT_PUBLIC_APP_URL` com a URL real de produção.

**Webhook Stripe** — criar no [Dashboard Stripe → Webhooks](https://dashboard.stripe.com/webhooks):

- URL: `https://seu-dominio.vercel.app/api/stripe/webhook`
- Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Página principal (home + chat)
│   ├── admin/                # Painel administrativo
│   ├── planos/               # Página de upgrade
│   └── api/
│       ├── chat/             # LLM + controle de tokens + admin bypass
│       ├── elevenlabs/       # TTS premium (ElevenLabs)
│       ├── lemonfox/         # TTS grátis (Lemonfox)
│       ├── stripe/           # Checkout, webhook, portal
│       └── admin/            # API de usuários, cupons e métricas
├── components/               # Componentes React
├── lib/                      # Tokens, avatares, gamificação, design system
├── services/                 # Clientes de APIs externas
├── hooks/                    # usePlan, useGamification, useMicrophoneDevices
└── types/                    # Tipos TypeScript e feature gates de planos
```

---

## Admin

Acesse `/admin` com uma conta que tenha `user_metadata.role = 'admin'` no Supabase Auth.

Para criar um admin via Supabase Dashboard → Authentication → Users → editar usuário → Additional data:
```json
{ "role": "admin" }
```

O painel inclui:
- Gestão completa de usuários (criar, editar plano/role, deletar)
- Criação e gerenciamento de cupons de desconto
- Métricas de uso, conversões e gráficos de crescimento
- Visão geral de todos os avatares cadastrados

---

**Licença**: Projeto privado — todos os direitos reservados.
