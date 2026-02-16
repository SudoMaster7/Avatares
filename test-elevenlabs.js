#!/usr/bin/env node

/**
 * Script para testar a configuração do ElevenLabs
 * Execute com: node test-elevenlabs.js
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
    console.error('❌ ELEVENLABS_API_KEY não encontrada no .env.local');
    console.log('');
    console.log('📝 Para configurar:');
    console.log('1. Crie conta em https://elevenlabs.io');
    console.log('2. Vá em Settings > API Keys');
    console.log('3. Crie uma nova API key');
    console.log('4. Adicione no .env.local:');
    console.log('   ELEVENLABS_API_KEY=sua_chave_aqui');
    process.exit(1);
}

console.log('✅ API Key encontrada!');
console.log(`🔑 Key: ${API_KEY.substring(0, 10)}...`);

// Teste básico da API
async function testElevenLabsAPI() {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
                'xi-api-key': API_KEY
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`🎤 ${data.voices.length} vozes disponíveis na sua conta`);
            console.log('');
            console.log('📊 Primeiras 5 vozes:');
            data.voices.slice(0, 5).forEach((voice, index) => {
                console.log(`  ${index + 1}. ${voice.name} (${voice.voice_id})`);
            });
            console.log('');
            console.log('🚀 Configuração do ElevenLabs funcionando!');
            console.log('💡 Agora você pode usar vozes ultra-realistas nos avatares.');
        } else {
            console.error('❌ Erro na API:', response.status, response.statusText);
            console.log('');
            console.log('🔍 Possíveis causas:');
            console.log('• API key inválida');
            console.log('• Limite de requisições excedido');
            console.log('• Problema de conectividade');
        }
    } catch (error) {
        console.error('❌ Erro ao conectar com ElevenLabs:', error.message);
    }
}

testElevenLabsAPI();