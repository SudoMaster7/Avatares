/**
 * SUDO Education – Demo Avatar
 * Single avatar available for guests before login.
 * Limited to 3 messages to demonstrate the experience.
 */

import { AvatarConfig } from './avatars';

// The demo avatar is Professor Carlos (Matemática) with limited personality
export const DEMO_AVATAR: AvatarConfig = {
    id: 'demo-prof-carlos',
    name: 'Professor Carlos',
    type: 'teacher',
    subject: 'Matemática',
    language: 'pt-BR',
    description: 'Professor de matemática da Vila do Saber. Experimente conversar com ele!',
    personality: `Você é o Professor Carlos, um professor de matemática carismático na Vila do Saber.

IMPORTANTE - ESTA É UMA DEMONSTRAÇÃO:
- Você tem apenas 3 mensagens para impressionar o aluno
- Seja MUITO animado e engajador
- Mostre o valor da plataforma
- Na 3ª mensagem, mencione que há muito mais avatares disponíveis

Características:
- Extremamente simpático e motivador
- Usa emojis com moderação (1-2 por mensagem)
- Faz a matemática parecer divertida
- Respostas curtas e impactantes (2-3 frases)

Fluxo das mensagens:
1ª mensagem: Cumprimente com energia, faça uma pergunta sobre matemática
2ª mensagem: Responda e mostre como você pode ajudar
3ª mensagem: Despeça-se e diga que há Einstein, Da Vinci e outros esperando por ele!`,
    imageUrl: '/avatars/prof-carlos.png',
    voiceConfig: {
        googleVoiceName: 'pt-BR-Wavenet-B',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
    },
    difficulty: 'beginner',
};

// Demo conversation starters (shown before user types)
export const DEMO_STARTERS = [
    'Me explica frações de um jeito fácil?',
    'Por que matemática é importante?',
    'Me dá uma dica de estudos!',
];

// Messages shown after demo limit is reached
export const DEMO_LIMIT_MESSAGES = {
    title: '🎉 Você completou a demonstração!',
    subtitle: 'Gostou de conversar com o Professor Carlos?',
    benefits: [
        '🧠 Einstein te ensina física de forma incrível',
        '🎨 Da Vinci revela segredos da arte e ciência',
        '✈️ Santos Dumont conta histórias de aviação',
        '⚡ Tesla explica eletricidade e invenções',
        '🏀 LeBron James motiva sobre esportes e disciplina',
    ],
    ctas: {
        free: {
            label: 'Criar conta grátis',
            description: '50 mensagens/dia + 3 avatares',
        },
        pro: {
            label: 'Começar com Pro',
            description: 'Ilimitado + todos os avatares + voz premium',
            highlight: '7 dias grátis!',
        },
    },
};
