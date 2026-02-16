# 🔧 Guia Técnico - Implementação dos 13 Avatares e Mini-games

## PARTE 1: EXPANDINDO AVATARES (Semana 1)

### Passo 1: Novo Arquivo - `src/lib/subjects.ts`

```typescript
// Mapear todas as 13 matérias com metadados
export interface Subject {
    id: string;
    name: string;
    emoji: string;
    color: string;
    description: string;
    gradeLevel: 'elementary' | 'middle' | 'high';
    abbreviation: string;
}

export const SUBJECTS: Subject[] = [
    {
        id: 'math',
        name: 'Matemática',
        emoji: '🔢',
        color: '#3B82F6',
        description: 'Números, geometria, álgebra e cálculos',
        gradeLevel: 'elementary',
        abbreviation: 'MAT',
    },
    {
        id: 'portuguese',
        name: 'Português',
        emoji: '📖',
        color: '#10B981',
        description: 'Literatura, gramática e redação',
        gradeLevel: 'elementary',
        abbreviation: 'PORT',
    },
    {
        id: 'science',
        name: 'Ciências',
        emoji: '🔬',
        color: '#8B5CF6',
        description: 'Biologia, física e química',
        gradeLevel: 'elementary',
        abbreviation: 'CIEN',
    },
    {
        id: 'history',
        name: 'História',
        emoji: '📜',
        color: '#92400E',
        description: 'História do Brasil e mundo',
        gradeLevel: 'elementary',
        abbreviation: 'HIST',
    },
    {
        id: 'geography',
        name: 'Geografia',
        emoji: '🌍',
        color: '#06B6D4',
        description: 'Mapas, climas e culturas',
        gradeLevel: 'elementary',
        abbreviation: 'GEOG',
    },
    {
        id: 'english',
        name: 'Inglês',
        emoji: '🇬🇧',
        color: '#F97316',
        description: 'Conversação e gramática em inglês',
        gradeLevel: 'elementary',
        abbreviation: 'ENG',
    },
    {
        id: 'physical-ed',
        name: 'Educação Física',
        emoji: '⚽',
        color: '#EF4444',
        description: 'Esportes, saúde e movimento',
        gradeLevel: 'elementary',
        abbreviation: 'EF',
    },
    {
        id: 'art',
        name: 'Arte',
        emoji: '🎨',
        color: '#EC4899',
        description: 'Artes plásticas e criatividade',
        gradeLevel: 'elementary',
        abbreviation: 'ARTE',
    },
    {
        id: 'music',
        name: 'Música',
        emoji: '🎵',
        color: '#6366F1',
        description: 'Notas, ritmo e história da música',
        gradeLevel: 'elementary',
        abbreviation: 'MUS',
    },
    {
        id: 'philosophy',
        name: 'Filosofia',
        emoji: '🤔',
        color: '#6B7280',
        description: 'Ética, lógica e pensamento crítico',
        gradeLevel: 'high',
        abbreviation: 'FILOS',
    },
    {
        id: 'ethics',
        name: 'Religião/Ética',
        emoji: '☮️',
        color: '#F59E0B',
        description: 'Valores, ética e compaixão',
        gradeLevel: 'elementary',
        abbreviation: 'ÉTICA',
    },
    {
        id: 'computer-science',
        name: 'Informática',
        emoji: '💻',
        color: '#06B6D4',
        description: 'Programação e lógica',
        gradeLevel: 'middle',
        abbreviation: 'INFO',
    },
    {
        id: 'spanish',
        name: 'Espanhol',
        emoji: '🇪🇸',
        color: '#F59E0B',
        description: 'Conversação em espanhol e cultura',
        gradeLevel: 'middle',
        abbreviation: 'ESP',
    },
];

export function getSubjectById(id: string): Subject | undefined {
    return SUBJECTS.find(s => s.id === id);
}

export function getSubjectsByGrade(grade: 'elementary' | 'middle' | 'high'): Subject[] {
    return SUBJECTS.filter(s => s.gradeLevel === grade);
}
```

### Passo 2: Atualizar `src/lib/avatars.ts`

Expandir com todos os 13 avatares:

```typescript
export interface AvatarConfig {
    id: string;
    name: string;
    type: 'teacher' | 'tutor' | 'historical' | 'mentor';
    subject: string;
    subjectId: string; // Link para SUBJECTS
    language: string;
    description: string;
    personality: string;
    imageUrl: string;
    backgroundColor: string;
    voiceConfig: {
        voiceName?: string;
        rate: number;
        pitch: number;
        volume: number;
    };
}

export const AVATARS: AvatarConfig[] = [
    // ========== EXISTENTES ==========
    {
        id: 'prof-matematica',
        name: 'Professor Carlos',
        type: 'teacher',
        subject: 'Matemática',
        subjectId: 'math',
        language: 'pt-BR',
        description: 'Professor experiente de matemática, especializado em ensino médio.',
        personality: `Você é o Professor Carlos, um professor de matemática apaixonado por ensinar...`,
        imageUrl: '/avatars/prof-carlos.png',
        backgroundColor: '#3B82F6',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-B',
            rate: 0.9,
            pitch: 0.9,
            volume: 1.0,
        },
    },
    
    // ... (Sarah e Dom Pedro II existentes)
    
    // ========== NOVOS AVATARES ==========
    {
        id: 'profa-mariana',
        name: 'Profa. Mariana',
        type: 'teacher',
        subject: 'Português',
        subjectId: 'portuguese',
        language: 'pt-BR',
        description: 'Professora apaixonada por literatura e redação criativa.',
        personality: `Você é a Profa. Mariana, uma professora de português culta e inspiradora.

Características:
- Apaixonada por literatura
- Estimula a criatividade
- Corrige gentilmente
- Faz conexões com obras clássicas
- Linguagem elegante mas acessível

Estilo:
- Sugira leituras
- Faça perguntas reflexivas
- Celebre a criatividade dos alunos
- Mantenha respostas em 2-3 frases`,
        imageUrl: '/avatars/profa-mariana.png',
        backgroundColor: '#10B981',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-C',
            rate: 0.95,
            pitch: 1.1,
            volume: 1.0,
        },
    },
    {
        id: 'prof-bruno',
        name: 'Prof. Bruno',
        type: 'teacher',
        subject: 'Ciências',
        subjectId: 'science',
        language: 'pt-BR',
        description: 'Professor entusiasmado que torna a ciência divertida e fascinante.',
        personality: `Você é o Prof. Bruno, um professor de ciências entusiasmado e engajador.

Características:
- Entusiasmado com descobertas
- Faz perguntas provocativas
- Relaciona teoria com prática
- Usa exemplos do dia a dia
- Energético e positivo

Estilo:
- Comece com uma pergunta intrigante
- Explique passo a passo
- Use analogias criativas
- Celebre compreensão
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/prof-bruno.png',
        backgroundColor: '#8B5CF6',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-B',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
        },
    },
    {
        id: 'profa-sofia',
        name: 'Profa. Sofia',
        type: 'teacher',
        subject: 'Geografia',
        subjectId: 'geography',
        language: 'pt-BR',
        description: 'Professora aventureira que adora explorar o mundo com seus alunos.',
        personality: `Você é a Profa. Sofia, uma professora de geografia aventureira.

Características:
- Curiosa e aventureira
- Faz viagens virtuais
- Conecta geografia com cultura
- Usa dados e mapas
- Inspiradora

Estilo:
- Abra com um lugar interessante
- Conte histórias de lugares
- Faça perguntas sobre o mundo
- Mantenha entusiasmo
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/profa-sofia.png',
        backgroundColor: '#06B6D4',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-A',
            rate: 0.95,
            pitch: 1.05,
            volume: 1.0,
        },
    },
    {
        id: 'prof-lucas',
        name: 'Prof. Lucas',
        type: 'teacher',
        subject: 'Educação Física',
        subjectId: 'physical-ed',
        language: 'pt-BR',
        description: 'Professor energético que torna o esporte divertido e inclusivo.',
        personality: `Você é o Prof. Lucas, um professor de educação física energético.

Características:
- Motivador e positivo
- Faz esporte parecer divertido
- Respeitoso com limites
- Entusiasmado
- Prático

Estilo:
- Comece com entusiasmo
- Explique técnicas claramente
- Encoraje tentativas
- Celebre esforço
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/prof-lucas.png',
        backgroundColor: '#EF4444',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-B',
            rate: 1.05,
            pitch: 1.0,
            volume: 1.0,
        },
    },
    {
        id: 'mestra-carolina',
        name: 'Mestra Carolina',
        type: 'mentor',
        subject: 'Arte',
        subjectId: 'art',
        language: 'pt-BR',
        description: 'Artista criativa que inspira alunos a explorar sua criatividade.',
        personality: `Você é a Mestra Carolina, uma artista criativa e inspiradora.

Características:
- Criativa e inovadora
- Estimula auto-expressão
- Conhece história da arte
- Entusiasmada com criatividade
- Não-julgadora

Estilo:
- Comece com uma obra de arte
- Faça perguntas abertas
- Encoraje experimentação
- Celebrate uniqueness
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/mestra-carolina.png',
        backgroundColor: '#EC4899',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-A',
            rate: 0.95,
            pitch: 1.15,
            volume: 1.0,
        },
    },
    {
        id: 'maestro-antonio',
        name: 'Maestro Antônio',
        type: 'mentor',
        subject: 'Música',
        subjectId: 'music',
        language: 'pt-BR',
        description: 'Maestro apaixonado que torna a música acessível para todos.',
        personality: `Você é o Maestro Antônio, um músico apaixonado e paciente.

Características:
- Apaixonado por música
- Paciente com iniciantes
- Conhecimento profundo
- Alegre e positivo
- Inspirador

Estilo:
- Comece com entusiasmo
- Explique conceitos musicais
- Use exemplos de músicas conhecidas
- Encoraje prática
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/maestro-antonio.png',
        backgroundColor: '#6366F1',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-C',
            rate: 0.9,
            pitch: 0.95,
            volume: 1.0,
        },
    },
    {
        id: 'socrates',
        name: 'Sócrates',
        type: 'historical',
        subject: 'Filosofia',
        subjectId: 'philosophy',
        language: 'pt-BR',
        description: 'Filósofo antigo que usa diálogos para explorar verdades profundas.',
        personality: `Você é Sócrates, o antigo filósofo grego (traduzido para português).

Características:
- Questionador socrático
- Faz muitas perguntas
- Quer explorar ideias profundas
- Respeitoso e sábio
- Antigo mas ainda relevante

Estilo:
- Comece com uma pergunta provocadora
- Faça série de perguntas
- Guie o aluno ao insight
- Seja respeitoso
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/socrates.png',
        backgroundColor: '#6B7280',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-B',
            rate: 0.85,
            pitch: 0.9,
            volume: 1.0,
        },
    },
    {
        id: 'monge-tenzin',
        name: 'Monge Tenzin',
        type: 'mentor',
        subject: 'Religião/Ética',
        subjectId: 'ethics',
        language: 'pt-BR',
        description: 'Monge sereno que ensina valores universais e compaixão.',
        personality: `Você é o Monge Tenzin, um mestre espiritual sereno e compassivo.

Características:
- Sereno e paciente
- Ensina compaixão
- Conecta ética com vida real
- Sábio mas humilde
- Inclusivo

Estilo:
- Comece com uma história ou parábola
- Faça perguntas reflexivas
- Conecte com valores universais
- Seja gentil e compreensivo
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/monge-tenzin.png',
        backgroundColor: '#F59E0B',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-A',
            rate: 0.85,
            pitch: 0.85,
            volume: 0.95,
        },
    },
    {
        id: 'dev-ana',
        name: 'Dev Ana',
        type: 'teacher',
        subject: 'Informática',
        subjectId: 'computer-science',
        language: 'pt-BR',
        description: 'Programadora moderna que torna programação divertida e acessível.',
        personality: `Você é a Dev Ana, uma programadora moderna e entusiasmada.

Características:
- Tech-savvy e moderna
- Torna código divertido
- Paciente com iniciantes
- Problem-solver
- Positiva

Estilo:
- Comece com um problema prático
- Explique lógica claramente
- Use exemplos do mundo real
- Encoraje experimentação
- Respostas em 2-3 frases`,
        imageUrl: '/avatars/dev-ana.png',
        backgroundColor: '#06B6D4',
        voiceConfig: {
            voiceName: 'pt-BR-Wavenet-C',
            rate: 1.0,
            pitch: 1.1,
            volume: 1.0,
        },
    },
    {
        id: 'senorita-isabella',
        name: 'Señorita Isabella',
        type: 'tutor',
        subject: 'Espanhol',
        subjectId: 'spanish',
        language: 'es',
        description: 'Tutora de espanhol entusiasmada que adora compartilhar cultura.',
        personality: `Eres Señorita Isabella, una tutora de español entusiasmada y colorida.

Características:
- Entusiasta y alegre
- Adora compartilhar cultura
- Paciente con estudiantes
- Usa mucho entusiasmo
- Inclusiva

Estilo:
- Comienza con entusiasmo
- Explica con paciencia
- Usa ejemplos culturales
- Celebra esfuerzos
- Respuestas en 2-3 frases`,
        imageUrl: '/avatars/senorita-isabella.png',
        backgroundColor: '#F59E0B',
        voiceConfig: {
            voiceName: 'es-ES-Wavenet-A',
            rate: 1.0,
            pitch: 1.2,
            volume: 1.0,
        },
    },
];

export function getAvatarById(id: string): AvatarConfig | undefined {
    return AVATARS.find(avatar => avatar.id === id);
}

export function getAvatarsBySubject(subjectId: string): AvatarConfig[] {
    return AVATARS.filter(avatar => avatar.subjectId === subjectId);
}

export function getAllAvatars(): AvatarConfig[] {
    return AVATARS;
}
```

---

## PARTE 2: ESTRUTURA DE MINI-GAMES (Semana 2-3)

### Passo 1: `src/types/miniGames.ts`

```typescript
export interface MiniGame {
    id: string;
    name: string;
    description: string;
    subjectId: string;
    type: 'quiz' | 'drag-drop' | 'sequence' | 'matching' | 'typing';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDurationSeconds: number;
    maxScore: number;
    config: Record<string, any>; // Configuração específica do jogo
}

export interface MiniGameResult {
    gameId: string;
    score: number;
    timeTakenSeconds: number;
    totalQuestions?: number;
    correctAnswers?: number;
    completedAt: Date;
}

export interface GameQuestion {
    id: string;
    question: string | React.ReactNode;
    type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop' | 'sorting';
    correctAnswer: string | number;
    options?: string[] | number[];
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
}
```

### Passo 2: `src/lib/miniGames.ts`

```typescript
import { MiniGame } from '@/types/miniGames';

export const MINI_GAMES: MiniGame[] = [
    // ============= MATEMÁTICA =============
    {
        id: 'math-quiz-lightning',
        name: 'Quiz Relâmpago de Matemática',
        description: '5 perguntas contra o cronômetro',
        subjectId: 'math',
        type: 'quiz',
        difficulty: 'beginner',
        estimatedDurationSeconds: 300, // 5 min
        maxScore: 500, // 100 por pergunta + bônus velocidade
        config: {
            questionCount: 5,
            timePerQuestion: 60,
            bonusTime: true,
        },
    },
    {
        id: 'math-expression-builder',
        name: 'Montador de Expressões',
        description: 'Arraste números para criar expressões corretas',
        subjectId: 'math',
        type: 'drag-drop',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 600,
        maxScore: 300,
        config: {
            questionCount: 6,
            allowedOperations: ['+', '-', '×', '÷'],
        },
    },
    {
        id: 'math-memory-operations',
        name: 'Memória Numérica',
        description: 'Encontre pares de operações equivalentes',
        subjectId: 'math',
        type: 'matching',
        difficulty: 'beginner',
        estimatedDurationSeconds: 480,
        maxScore: 400,
        config: {
            pairCount: 8,
        },
    },
    {
        id: 'math-graph-builder',
        name: 'Construtor de Gráficos',
        description: 'Monte gráficos baseado em dados',
        subjectId: 'math',
        type: 'drag-drop',
        difficulty: 'advanced',
        estimatedDurationSeconds: 900,
        maxScore: 600,
        config: {
            graphTypes: ['bar', 'line', 'pie'],
            questionCount: 4,
        },
    },

    // ============= PORTUGUÊS =============
    {
        id: 'portuguese-text-corrector',
        name: 'Corretor de Textos',
        description: 'Corrija erros gramaticais em frases',
        subjectId: 'portuguese',
        type: 'typing',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 600,
        maxScore: 400,
        config: {
            sentenceCount: 5,
            errorTypes: ['agreement', 'verb-conjugation', 'punctuation'],
        },
    },
    {
        id: 'portuguese-rhyme-game',
        name: 'Jogo da Rima',
        description: 'Complete frases com palavras que rimam',
        subjectId: 'portuguese',
        type: 'multiple-choice',
        difficulty: 'beginner',
        estimatedDurationSeconds: 300,
        maxScore: 300,
        config: {
            questionCount: 6,
        },
    },
    {
        id: 'portuguese-story-sequence',
        name: 'Sequência de Histórias',
        description: 'Organize parágrafos em ordem correta',
        subjectId: 'portuguese',
        type: 'sequence',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 480,
        maxScore: 350,
        config: {
            storyCount: 4,
            paragraphsPerStory: 4,
        },
    },
    {
        id: 'portuguese-word-search',
        name: 'Caça-Palavras Educativo',
        description: 'Encontre vocabulário temático escondido',
        subjectId: 'portuguese',
        type: 'drag-drop',
        difficulty: 'beginner',
        estimatedDurationSeconds: 540,
        maxScore: 300,
        config: {
            gridSize: 10,
            wordCount: 8,
        },
    },

    // ============= CIÊNCIAS =============
    {
        id: 'science-molecule-builder',
        name: 'Montador de Moléculas',
        description: 'Arraste átomos para criar moléculas corretas',
        subjectId: 'science',
        type: 'drag-drop',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 600,
        maxScore: 400,
        config: {
            moleculeCount: 5,
        },
    },
    {
        id: 'science-water-cycle',
        name: 'Ciclo da Água',
        description: 'Clique na sequência correta do ciclo',
        subjectId: 'science',
        type: 'sequence',
        difficulty: 'beginner',
        estimatedDurationSeconds: 300,
        maxScore: 300,
        config: {
            stageCount: 5,
        },
    },
    {
        id: 'science-organism-classifier',
        name: 'Classificador de Seres Vivos',
        description: 'Arraste organismos para categorias corretas',
        subjectId: 'science',
        type: 'drag-drop',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 480,
        maxScore: 350,
        config: {
            categories: ['mammals', 'birds', 'reptiles', 'fish', 'amphibians'],
            itemCount: 15,
        },
    },
    {
        id: 'science-virtual-experiment',
        name: 'Experimento Virtual',
        description: 'Simule um experimento científico passo a passo',
        subjectId: 'science',
        type: 'sequence',
        difficulty: 'advanced',
        estimatedDurationSeconds: 900,
        maxScore: 500,
        config: {
            experimentCount: 3,
        },
    },

    // ============= HISTÓRIA =============
    {
        id: 'history-timeline-interactive',
        name: 'Timeline Interativa',
        description: 'Organize eventos na linha do tempo correta',
        subjectId: 'history',
        type: 'sequence',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 600,
        maxScore: 400,
        config: {
            eventCount: 8,
            timeSpan: '500 years',
        },
    },
    {
        id: 'history-quiz',
        name: 'Quiz Histórico',
        description: 'Responda perguntas sobre períodos históricos',
        subjectId: 'history',
        type: 'quiz',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 480,
        maxScore: 400,
        config: {
            questionCount: 8,
        },
    },
    {
        id: 'history-cause-effect',
        name: 'Causa e Efeito',
        description: 'Conecte eventos históricos com suas consequências',
        subjectId: 'history',
        type: 'matching',
        difficulty: 'advanced',
        estimatedDurationSeconds: 540,
        maxScore: 350,
        config: {
            pairCount: 6,
        },
    },
    {
        id: 'history-civilizations',
        name: 'Jogo das Civilizações',
        description: 'Identifique características de civilizações antigas',
        subjectId: 'history',
        type: 'matching',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 480,
        maxScore: 360,
        config: {
            civilizationCount: 6,
        },
    },

    // ============= GEOGRAFIA =============
    {
        id: 'geography-map-builder',
        name: 'Montador de Mapas',
        description: 'Arraste regiões para sua posição correta',
        subjectId: 'geography',
        type: 'drag-drop',
        difficulty: 'beginner',
        estimatedDurationSeconds: 480,
        maxScore: 350,
        config: {
            regionCount: 8,
            mapType: 'south-america',
        },
    },
    {
        id: 'geography-climate-match',
        name: 'Jogo dos Climas',
        description: 'Identifique o clima de cidades ao redor do mundo',
        subjectId: 'geography',
        type: 'matching',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 540,
        maxScore: 400,
        config: {
            cityCount: 8,
            climateTypes: ['tropical', 'temperate', 'desert', 'polar'],
        },
    },
    {
        id: 'geography-capital-rush',
        name: 'Capital Rush',
        description: 'Responda capitais contra o cronômetro',
        subjectId: 'geography',
        type: 'quiz',
        difficulty: 'beginner',
        estimatedDurationSeconds: 300,
        maxScore: 300,
        config: {
            questionCount: 10,
            timePerQuestion: 30,
        },
    },
    {
        id: 'geography-globe-explorer',
        name: 'Explorador do Globo',
        description: 'Explore características do planeta Terra em 3D',
        subjectId: 'geography',
        type: 'drag-drop',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 600,
        maxScore: 400,
        config: {
            featureCount: 10,
        },
    },

    // ============= INGLÊS =============
    {
        id: 'english-conversation-speed',
        name: 'Conversação Acelerada',
        description: 'Responda rápido em inglês contra o cronômetro',
        subjectId: 'english',
        type: 'typing',
        difficulty: 'advanced',
        estimatedDurationSeconds: 600,
        maxScore: 500,
        config: {
            conversationCount: 5,
            timePerQuestion: 120,
        },
    },
    {
        id: 'english-vocabulary-match',
        name: 'Teste de Vocabulário',
        description: 'Pareie palavras em inglês com imagens',
        subjectId: 'english',
        type: 'matching',
        difficulty: 'beginner',
        estimatedDurationSeconds: 300,
        maxScore: 300,
        config: {
            wordCount: 8,
        },
    },
    {
        id: 'english-pronunciation-game',
        name: 'Jogo da Pronúncia',
        description: 'Ouça e escolha a pronúncia correta',
        subjectId: 'english',
        type: 'quiz',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 420,
        maxScore: 350,
        config: {
            wordCount: 7,
        },
    },
    {
        id: 'english-sentence-builder',
        name: 'Construtor de Frases',
        description: 'Organize palavras em ordem para formar frases',
        subjectId: 'english',
        type: 'sequence',
        difficulty: 'intermediate',
        estimatedDurationSeconds: 480,
        maxScore: 360,
        config: {
            sentenceCount: 6,
        },
    },

    // ... (Continuará com as outras matérias)
];

export function getMiniGamesBySubject(subjectId: string): MiniGame[] {
    return MINI_GAMES.filter(game => game.subjectId === subjectId);
}

export function getMiniGameById(id: string): MiniGame | undefined {
    return MINI_GAMES.find(game => game.id === id);
}

export function getMiniGamesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): MiniGame[] {
    return MINI_GAMES.filter(game => game.difficulty === difficulty);
}
```

### Passo 3: `src/hooks/useMiniGame.ts`

```typescript
import { useState, useCallback } from 'react';
import { MiniGameResult } from '@/types/miniGames';

export interface UseMiniGameState {
    score: number;
    timeTaken: number;
    currentQuestion: number;
    totalQuestions: number;
    isComplete: boolean;
    startTime: Date | null;
}

export function useMiniGame(totalQuestions: number) {
    const [state, setState] = useState<UseMiniGameState>({
        score: 0,
        timeTaken: 0,
        currentQuestion: 1,
        totalQuestions,
        isComplete: false,
        startTime: new Date(),
    });

    const addScore = useCallback((points: number) => {
        setState(prev => ({
            ...prev,
            score: prev.score + points,
        }));
    }, []);

    const nextQuestion = useCallback(() => {
        setState(prev => {
            if (prev.currentQuestion >= prev.totalQuestions) {
                return {
                    ...prev,
                    isComplete: true,
                    timeTaken: prev.startTime ? 
                        Math.round((new Date().getTime() - prev.startTime.getTime()) / 1000) : 0,
                };
            }
            return {
                ...prev,
                currentQuestion: prev.currentQuestion + 1,
            };
        });
    }, []);

    const getResult = (): MiniGameResult => {
        return {
            gameId: '',
            score: state.score,
            timeTakenSeconds: state.timeTaken,
            totalQuestions: state.totalQuestions,
            correctAnswers: Math.round((state.score / (state.totalQuestions * 100)) * state.totalQuestions),
            completedAt: new Date(),
        };
    };

    const progressPercentage = (state.currentQuestion / state.totalQuestions) * 100;

    return {
        ...state,
        addScore,
        nextQuestion,
        getResult,
        progressPercentage,
    };
}
```

---

## PARTE 3: COMPONENTES DE MINI-GAMES (Semana 3)

### Passo 1: `src/components/miniGames/MiniGameContainer.tsx`

```typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MiniGame } from '@/types/miniGames';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Target } from 'lucide-react';

interface MiniGameContainerProps {
    game: MiniGame;
    children: React.ReactNode;
    progress: number; // 0-100
    score: number;
    timeRemaining?: number;
    onExit: () => void;
}

export function MiniGameContainer({
    game,
    children,
    progress,
    score,
    timeRemaining,
    onExit,
}: MiniGameContainerProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-2xl mx-auto mb-6"
            >
                <Card className="bg-white/80 backdrop-blur border-none shadow-lg">
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900">{game.name}</h2>
                                <p className="text-sm text-muted-foreground">{game.description}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onExit}
                            >
                                ✕
                            </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Progresso</span>
                                <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                                <Target className="w-4 h-4 text-blue-600" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Pontos</p>
                                    <p className="font-bold text-blue-600">{score}</p>
                                </div>
                            </div>
                            {timeRemaining !== undefined && (
                                <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Tempo</p>
                                        <p className="font-bold text-orange-600">{timeRemaining}s</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Game Content */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl mx-auto"
            >
                {children}
            </motion.div>
        </div>
    );
}
```

### Passo 2: `src/components/miniGames/games/QuizGame.tsx` (Template)

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MiniGameContainer } from '../MiniGameContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MiniGame } from '@/types/miniGames';
import { useMiniGame } from '@/hooks/useMiniGame';

interface QuizGameProps {
    game: MiniGame;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
        explanation?: string;
    }>;
    onComplete: (result: { score: number; time: number }) => void;
}

export function QuizGame({ game, questions, onComplete }: QuizGameProps) {
    const {
        score,
        currentQuestion,
        totalQuestions,
        addScore,
        nextQuestion,
        progressPercentage,
        isComplete,
    } = useMiniGame(questions.length);

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(game.config.timePerQuestion || 60);
    const [showExplanation, setShowExplanation] = useState(false);

    const currentQ = questions[currentQuestion - 1];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    // Timer
    useEffect(() => {
        if (isComplete) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isComplete]);

    const handleTimeUp = () => {
        if (selectedAnswer === null) {
            nextQuestion();
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        setShowExplanation(true);

        if (index === currentQ.correctAnswer) {
            addScore(100); // Base points
        }
    };

    const handleNext = () => {
        if (currentQuestion === totalQuestions) {
            onComplete({ score, time: game.estimatedDurationSeconds });
        } else {
            setSelectedAnswer(null);
            setShowExplanation(false);
            setTimeRemaining(game.config.timePerQuestion || 60);
            nextQuestion();
        }
    };

    if (isComplete) {
        return (
            <MiniGameContainer
                game={game}
                progress={100}
                score={score}
                onExit={() => onComplete({ score, time: game.estimatedDurationSeconds })}
            >
                <Card className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">🎉 Parabéns!</h3>
                    <p className="text-4xl font-bold text-blue-600 mb-2">{score}</p>
                    <p className="text-muted-foreground mb-6">
                        Pontuação Final
                    </p>
                    <Button onClick={handleNext} className="w-full">
                        Voltar
                    </Button>
                </Card>
            </MiniGameContainer>
        );
    }

    return (
        <MiniGameContainer
            game={game}
            progress={progressPercentage}
            score={score}
            timeRemaining={timeRemaining}
            onExit={() => {}}
        >
            <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
            >
                <Card className="p-6 mb-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {currentQ.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQ.options.map((option, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                                        selectedAnswer === index
                                            ? isCorrect
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-red-500 bg-red-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    } ${selectedAnswer !== null ? 'opacity-70' : ''}`}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>

                        {/* Explanation */}
                        {showExplanation && currentQ.explanation && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
                            >
                                <p className="text-sm text-gray-700">
                                    {currentQ.explanation}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {selectedAnswer !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Button
                                onClick={handleNext}
                                className="w-full"
                                variant={isCorrect ? 'default' : 'outline'}
                            >
                                {currentQuestion === totalQuestions ? 'Finalizar' : 'Próxima'}
                            </Button>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </MiniGameContainer>
    );
}
```

---

## PARTE 4: SISTEMA DE BADGES (Semana 4)

### `src/lib/badges.ts`

```typescript
export interface Badge {
    id: string;
    name: string;
    description: string;
    emoji: string;
    category: 'subject_master' | 'achievement' | 'social' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    color: string;
    requirements: {
        type: 'messages' | 'scenarios' | 'minigames' | 'streak' | 'level';
        value: number;
        subject?: string; // Se específico de matéria
    };
}

export const BADGES: Badge[] = [
    // ============= INICIANTES =============
    {
        id: 'first-step',
        name: 'Primeiros Passos',
        description: 'Envie sua primeira mensagem',
        emoji: '🦶',
        category: 'achievement',
        rarity: 'common',
        color: '#6B7280',
        requirements: { type: 'messages', value: 1 },
    },

    // ============= MATÉRIAS =============
    ...Array.from({ length: 13 }, (_, i) => ({
        id: `subject-starter-${i}`,
        name: `Iniciante em ${['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês', 'Educação Física', 'Arte', 'Música', 'Filosofia', 'Religião/Ética', 'Informática', 'Espanhol'][i]}`,
        description: `Tenha sua primeira interação nesta matéria`,
        emoji: ['🔢', '📖', '🔬', '📜', '🌍', '🇬🇧', '⚽', '🎨', '🎵', '🤔', '☮️', '💻', '🇪🇸'][i],
        category: 'subject_master' as const,
        rarity: 'common' as const,
        color: ['#3B82F6', '#10B981', '#8B5CF6', '#92400E', '#06B6D4', '#F97316', '#EF4444', '#EC4899', '#6366F1', '#6B7280', '#F59E0B', '#06B6D4', '#F59E0B'][i],
        requirements: { type: 'messages' as const, value: 5, subject: ['math', 'portuguese', 'science', 'history', 'geography', 'english', 'physical-ed', 'art', 'music', 'philosophy', 'ethics', 'computer-science', 'spanish'][i] },
    })),

    // ============= STREAKS =============
    {
        id: 'streak-3',
        name: '3 Dias Seguidos',
        description: 'Estude por 3 dias seguidos',
        emoji: '🔥',
        category: 'achievement',
        rarity: 'rare',
        color: '#EF4444',
        requirements: { type: 'streak', value: 3 },
    },
    {
        id: 'streak-7',
        name: 'Semana Dourada',
        description: 'Estude por 7 dias seguidos',
        emoji: '⭐',
        category: 'achievement',
        rarity: 'epic',
        color: '#FBBF24',
        requirements: { type: 'streak', value: 7 },
    },
    {
        id: 'streak-30',
        description: 'Estude por 30 dias seguidos',
        name: 'Dedicação Infinita',
        emoji: '👑',
        category: 'special',
        rarity: 'legendary',
        color: '#F59E0B',
        requirements: { type: 'streak', value: 30 },
    },
];
```

---

Este documento é a base para as próximas fases. Cada seção pode ser expandida quando você começar a implementar!
