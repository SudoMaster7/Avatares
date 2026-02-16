# 🎯 Guia de Configuração - Google Cloud Text-to-Speech

## 📋 Passo a Passo

### 1. Criar Conta Google Cloud (Grátis)

1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google
3. Aceite os termos de serviço
4. **Você ganha $300 de créditos grátis por 90 dias!**

### 2. Criar Projeto

1. No console, clique em "Select a project" (topo)
2. Clique em "NEW PROJECT"
3. Nome: `avatares-educacionais`
4. Clique em "CREATE"

### 3. Ativar API do Text-to-Speech

1. No menu lateral, vá em "APIs & Services" → "Library"
2. Busque por "Cloud Text-to-Speech API"
3. Clique em "ENABLE"
4. Aguarde ativação (~30 segundos)

### 4. Criar Credenciais (API Key)

1. Vá em "APIs & Services" → "Credentials"
2. Clique em "CREATE CREDENTIALS" → "API key"
3. Copie a chave gerada
4. **IMPORTANTE**: Clique em "RESTRICT KEY"
5. Em "API restrictions", selecione "Restrict key"
6. Marque apenas "Cloud Text-to-Speech API"
7. Clique em "SAVE"

### 5. Adicionar ao .env.local

```bash
GOOGLE_CLOUD_TTS_API_KEY="sua-chave-aqui"
```

### 6. Reiniciar Servidor

```bash
# Ctrl+C para parar
npm run dev
```

---

## 💰 Limites Gratuitos

**Tier Gratuito (Sempre):**
- 1 milhão de caracteres/mês (Standard)
- 1 milhão de caracteres/mês (WaveNet - voz premium)

**Após o limite:**
- Standard: $4 por 1M caracteres
- WaveNet: $16 por 1M caracteres

**Para o MVP:**
- ~100 conversas/dia = ~50k caracteres/mês
- **Você ficará no tier gratuito facilmente!** ✅

---

## 🗣️ Vozes Disponíveis

### Português (PT-BR)
- `pt-BR-Standard-A` - Feminina
- `pt-BR-Standard-B` - Masculina
- `pt-BR-Wavenet-A` - Feminina (Premium)
- `pt-BR-Wavenet-B` - Masculina (Premium)

### Inglês (EN-US)
- `en-US-Standard-C` - Feminina
- `en-US-Standard-D` - Masculina
- `en-US-Wavenet-C` - Feminina (Premium)
- `en-US-Wavenet-D` - Masculina (Premium)

---

## ✅ Pronto!

Após configurar, a aplicação usará vozes muito melhores automaticamente! 🎉

**Diferença:**
- ❌ Web Speech API: Voz robótica
- ✅ Google Cloud TTS: Voz natural e expressiva
