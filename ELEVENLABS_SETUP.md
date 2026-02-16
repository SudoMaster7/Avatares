# 🎙️ Configuração ElevenLabs para Vozes Realistas

## 📋 Resumo

O ElevenLabs foi integrado para fornecer vozes ultra-realistas aos avatares educacionais, oferecendo uma experiência muito mais natural e envolvente para os alunos.

## 🔑 Como Obter sua API Key

### 1. Criar Conta no ElevenLabs

1. Acesse [elevenlabs.io](https://elevenlabs.io)
2. Clique em **"Sign Up"**
3. Crie sua conta (pode usar Google/GitHub)
4. Confirme seu email

### 2. Obter API Key

1. Após login, vá em **Settings** (⚙️)
2. Clique em **"API Keys"**
3. Clique em **"Create API Key"**
4. Dê um nome (ex: "VoiceSync Avatares")
5. **COPIE a chave** (ela só aparece uma vez!)

### 3. Configurar no Projeto

1. Abra o arquivo `.env.local`
2. Substitua `your_elevenlabs_api_key_here` pela sua chave:

```bash
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🆓 Plano Gratuito

- **10.000 caracteres/mês** grátis
- Acesso às vozes pré-treinadas
- Qualidade profissional
- Múltiplos idiomas

## 🎯 Vozes Configuradas

### Avatares em Português
- **Professor Carlos**: Voz masculina profissional
- **Professora Mariana**: Voz feminina culta
- **Dom Pedro II**: Voz masculina histórica

### Avatares em Inglês  
- **Sarah**: Voz feminina calorosa e amigável

### Avatares em Espanhol
- **Señorita Isabella**: Voz feminina entusiasmada

## ⚡ Como Funciona

1. **Primeira opção**: ElevenLabs (se configurado)
2. **Fallback**: Google Cloud TTS
3. **Último recurso**: Web Speech API do navegador

## 🔧 Configuração Técnica

### Estrutura de Voz dos Avatares

Cada avatar agora tem configurações avançadas:

```typescript
voiceConfig: {
    // ElevenLabs (preferência)
    elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM',
    elevenLabsModelId: 'eleven_multilingual_v2',
    stability: 0.6,
    similarityBoost: 0.8,
    
    // Google TTS (fallback)
    googleVoiceName: 'pt-BR-Wavenet-B',
    rate: 0.9,
    pitch: 0.9,
    volume: 1.0,
}
```

### Parâmetros de Qualidade

- **Stability (0.0-1.0)**: Consistência da voz
  - 0.0 = Mais variada
  - 1.0 = Mais consistente

- **Similarity Boost (0.0-1.0)**: Fidelidade à voz original
  - 0.0 = Mais criativa
  - 1.0 = Mais fiel

## 🚀 Testando

Após configurar, teste com qualquer avatar:

1. Abra o dashboard
2. Selecione um avatar
3. Digite uma mensagem
4. Observe a qualidade da voz melhorada!

## ❗ Troubleshooting

### Erro: "ElevenLabs API key not configured"
- Verifique se a chave está no `.env.local`
- Reinicie o servidor (`npm run dev`)

### Voz não muda
- Limpe o cache do navegador
- Verifique se a chave está correta
- Confirme que não excedeu o limite mensal

### Fallback para Google TTS
- Normal se ElevenLabs falhar
- Verifique logs no console do navegador

## 📊 Monitoramento de Uso

- Acesse [elevenlabs.io/usage](https://elevenlabs.io/usage)
- Monitore caracteres consumidos
- Configure alertas de limite

## 🔄 Alternando Serviços

Para usar apenas Google TTS temporariamente:

```bash
# No .env.local
PREFERRED_TTS_SERVICE=google
```

Para voltar ao ElevenLabs:

```bash
PREFERRED_TTS_SERVICE=elevenlabs
```

## 🎨 Personalizando Vozes

### Adicionando Nova Voz

1. No ElevenLabs, encontre o Voice ID desejado
2. Edite `src/lib/avatars.ts`
3. Atualize o `elevenLabsVoiceId` do avatar

### Voice IDs Recomendados

```typescript
// Masculinas em Português
'21m00Tcm4TlvDq8ikWAM' // Rachel - profissional
'VR6AewLTigWG4xSOukaG' // Arnold - grave

// Femininas em Português  
'EXAVITQu4vr4xnSDxMaL' // Bella - amigável
'pNInz6obpgDQGcFmaJgB' // Adam - suave

// Inglês
'21m00Tcm4TlvDq8ikWAM' // Rachel - clara
'EXAVITQu4vr4xnSDxMaL' // Bella - calorosa
```

## ✅ Checklist de Configuração

- [ ] Conta criada no ElevenLabs
- [ ] API Key obtida
- [ ] Chave configurada no `.env.local`
- [ ] Servidor reiniciado
- [ ] Teste realizado com avatar
- [ ] Qualidade de voz verificada
- [ ] Uso monitorado no painel

## 🎯 Próximos Passos

Com vozes realistas configuradas, você pode:

1. **Testar diferentes personalidades** dos avatares
2. **Ajustar parâmetros** de stabilidade/similaridade  
3. **Adicionar novos avatares** com vozes únicas
4. **Monitorar feedback** dos usuários sobre a qualidade
5. **Considerar upgrade** se precisar de mais caracteres

## 📱 Suporte

- **ElevenLabs**: [support.elevenlabs.io](https://support.elevenlabs.io)
- **Documentação**: [docs.elevenlabs.io](https://docs.elevenlabs.io)
- **Discord**: Comunidade ativa para dúvidas