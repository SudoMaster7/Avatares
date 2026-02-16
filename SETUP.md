# 🎓 Avatares Educacionais - Guia de Setup (Versão Gratuita)

## 🆓 APIs Gratuitas Utilizadas

- **Groq**: LLM gratuito (14,400 req/dia)
- **Whisper (Transformers.js)**: STT no browser (100% grátis)
- **Web Speech API**: TTS nativo do browser (100% grátis)
- **Supabase**: PostgreSQL + Auth (500MB grátis)
- **Vercel**: Hospedagem (100GB/mês grátis)

**Custo Total: R$ 0/mês** ✨

---

## 📦 Instalação

### 1. Clone e Instale Dependências

```bash
cd avatares-educacionais
npm install
```

**Dependências instaladas:**
- `groq-sdk` - LLM gratuito
- `@xenova/transformers` - Whisper no browser
- `@supabase/supabase-js` - Database gratuito
- `next`, `react`, `tailwindcss` - Framework

---

## 🔑 Configuração de APIs

### 1. Groq (LLM Gratuito)

1. Acesse: https://console.groq.com
2. Crie uma conta (grátis)
3. Vá em "API Keys"
4. Crie uma nova chave
5. Copie a chave

**Limites**: 14,400 requisições/dia (~600/hora)

### 2. Supabase (Database Gratuito)

1. Acesse: https://supabase.com
2. Crie uma conta
3. Crie um novo projeto
4. Vá em "Settings" → "API"
5. Copie:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon/public key` (NEXT_PUBLIC_SUPABASE_ANON_KEY)

**Limites**: 500MB database, 2GB bandwidth/mês

### 3. Configure `.env.local`

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"

# Groq
GROQ_API_KEY="sua-chave-groq"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
```

Para gerar o `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## 🗄️ Setup do Banco de Dados

### Opção 1: Supabase (Recomendado - Grátis)

1. No dashboard do Supabase, vá em "SQL Editor"
2. Copie o conteúdo de `database/schema.sql`
3. Cole e execute no SQL Editor
4. Pronto! Tabelas criadas ✅

### Opção 2: PostgreSQL Local

```bash
# Crie o banco
createdb avatares_educacionais

# Execute o schema
psql avatares_educacionais < database/schema.sql
```

---

## 🚀 Rodando o Projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 🎤 Testando as APIs

### Teste do Groq (LLM)

```typescript
import { generateResponse } from '@/services/groq';

const response = await generateResponse({
  messages: [
    { role: 'system', content: 'Você é um professor de matemática.' },
    { role: 'user', content: 'Explique o teorema de Pitágoras.' }
  ]
});

console.log(response); // Resposta do LLM
```

### Teste do Whisper (STT)

```typescript
import { initializeWhisper, transcribeAudio } from '@/services/whisper';

// Inicializa (primeira vez demora ~10s)
await initializeWhisper();

// Transcreve áudio
const result = await transcribeAudio(audioBlob);
console.log(result.text); // Transcrição
```

### Teste do TTS (Web Speech)

```typescript
import { speak, getPortugueseVoices } from '@/services/tts';

// Lista vozes disponíveis
const voices = getPortugueseVoices();
console.log(voices);

// Fala texto
await speak({
  text: 'Olá, eu sou um avatar educacional!',
  language: 'pt-BR',
  rate: 1.0,
  pitch: 1.0,
});
```

---

## 📊 Limitações e Performance

### Groq (LLM)
- ✅ **Grátis**: 14,400 req/dia
- ✅ **Rápido**: ~500ms latência
- ⚠️ **Limite**: ~600 conversas/hora

### Whisper (Browser)
- ✅ **Grátis**: 100% local
- ✅ **Privado**: Dados não saem do browser
- ⚠️ **Primeira carga**: ~10s (download do modelo)
- ⚠️ **Latência**: ~1-2s por transcrição

### Web Speech API (TTS)
- ✅ **Grátis**: Nativo do browser
- ✅ **Instantâneo**: Sem latência
- ⚠️ **Qualidade**: Vozes robóticas (não tão naturais)
- ⚠️ **Variável**: Depende do navegador/SO

### Supabase
- ✅ **Grátis**: 500MB + 2GB bandwidth
- ✅ **Auth incluído**: Sistema pronto
- ⚠️ **Limite**: ~50k requisições/mês

---

## 🔄 Próximos Passos

1. ✅ APIs configuradas
2. ✅ Banco de dados criado
3. [ ] Criar componentes de UI
4. [ ] Implementar 3 avatares iniciais
5. [ ] Criar cenários educacionais
6. [ ] Sistema de conversação em tempo real

---

## 💡 Dicas de Otimização

### Reduzir Latência do Whisper
- Use modelo `whisper-tiny` (mais rápido, menos preciso)
- Processe áudio em chunks menores

### Melhorar Qualidade do TTS
- Use vozes premium do sistema (Windows: Microsoft David/Zira)
- Ajuste `rate` e `pitch` para cada avatar

### Economizar Requisições do Groq
- Implemente cache de respostas comuns
- Use `max_tokens` menor (300-400)

---

## 🆘 Troubleshooting

### "Whisper model not loading"
- Verifique conexão com internet (primeira carga)
- Limpe cache do browser
- Tente modelo menor: `whisper-tiny`

### "Groq API rate limit"
- Você atingiu 14,400 req/dia
- Aguarde 24h ou implemente cache

### "No voices available (TTS)"
- Aguarde 1-2 segundos após carregar página
- Chame `initializeTTS()` antes de usar

### "Supabase connection error"
- Verifique `.env.local`
- Confirme que URL e chave estão corretas
- Verifique se projeto Supabase está ativo

---

## 📚 Documentação das APIs

- **Groq**: https://console.groq.com/docs
- **Transformers.js**: https://huggingface.co/docs/transformers.js
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Supabase**: https://supabase.com/docs

---

**Pronto! Agora você tem um MVP 100% gratuito! 🎉**
