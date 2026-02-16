# 🎨 COMPONENTES PRONTOS PARA IMPLEMENTAÇÃO

## Componentes Recomendados para Semana 1

Aqui estão exemplos práticos de código que você pode começar a implementar imediatamente.

---

## 1. NOVO ARQUIVO: `src/lib/subjects.ts`

Copie e cole diretamente:

```typescript
// Mapear todas as 13 matérias do colégio com metadados
export interface Subject {
    id: string;
    name: string;
    emoji: string;
    hexColor: string;
    description: string;
    gradeLevel: 'elementary' | 'middle' | 'high';
    abbreviation: string;
    icon?: string;
}

export const SUBJECTS: Subject[] = [
    {
        id: 'math',
        name: 'Matemática',
        emoji: '🔢',
        hexColor: '#3B82F6',
        description: 'Números, geometria, álgebra e cálculos práticos',
        gradeLevel: 'elementary',
        abbreviation: 'MAT',
    },
    {
        id: 'portuguese',
        name: 'Português',
        emoji: '📖',
        hexColor: '#10B981',
        description: 'Literatura, gramática, redação criativa e poesia',
        gradeLevel: 'elementary',
        abbreviation: 'PORT',
    },
    {
        id: 'science',
        name: 'Ciências',
        emoji: '🔬',
        hexColor: '#8B5CF6',
        description: 'Biologia, física, química e descobertas científicas',
        gradeLevel: 'elementary',
        abbreviation: 'CIEN',
    },
    {
        id: 'history',
        name: 'História',
        emoji: '📜',
        hexColor: '#92400E',
        description: 'História do Brasil, mundo e períodos importantes',
        gradeLevel: 'elementary',
        abbreviation: 'HIST',
    },
    {
        id: 'geography',
        name: 'Geografia',
        emoji: '🌍',
        hexColor: '#06B6D4',
        description: 'Mapas, climas, culturas e características do planeta',
        gradeLevel: 'elementary',
        abbreviation: 'GEOG',
    },
    {
        id: 'english',
        name: 'Inglês',
        emoji: '🇬🇧',
        hexColor: '#F97316',
        description: 'Conversação, gramática e vocabulário em inglês',
        gradeLevel: 'elementary',
        abbreviation: 'ENG',
    },
    {
        id: 'physical-ed',
        name: 'Educação Física',
        emoji: '⚽',
        hexColor: '#EF4444',
        description: 'Esportes, saúde, movimento e bem-estar',
        gradeLevel: 'elementary',
        abbreviation: 'EF',
    },
    {
        id: 'art',
        name: 'Arte',
        emoji: '🎨',
        hexColor: '#EC4899',
        description: 'Artes plásticas, criatividade e expressão visual',
        gradeLevel: 'elementary',
        abbreviation: 'ARTE',
    },
    {
        id: 'music',
        name: 'Música',
        emoji: '🎵',
        hexColor: '#6366F1',
        description: 'Notas, ritmo, história da música e composição',
        gradeLevel: 'elementary',
        abbreviation: 'MUS',
    },
    {
        id: 'philosophy',
        name: 'Filosofia',
        emoji: '🤔',
        hexColor: '#6B7280',
        description: 'Ética, lógica, pensamento crítico e reflexão',
        gradeLevel: 'high',
        abbreviation: 'FILOS',
    },
    {
        id: 'ethics',
        name: 'Religião/Ética',
        emoji: '☮️',
        hexColor: '#F59E0B',
        description: 'Valores universais, ética, compaixão e respeito',
        gradeLevel: 'elementary',
        abbreviation: 'ÉTICA',
    },
    {
        id: 'computer-science',
        name: 'Informática',
        emoji: '💻',
        hexColor: '#06B6D4',
        description: 'Programação, lógica computacional e segurança digital',
        gradeLevel: 'middle',
        abbreviation: 'INFO',
    },
    {
        id: 'spanish',
        name: 'Espanhol',
        emoji: '🇪🇸',
        hexColor: '#F59E0B',
        description: 'Conversação em espanhol e cultura latino-americana',
        gradeLevel: 'middle',
        abbreviation: 'ESP',
    },
];

// Funções auxiliares
export function getSubjectById(id: string): Subject | undefined {
    return SUBJECTS.find(s => s.id === id);
}

export function getSubjectsByGrade(grade: 'elementary' | 'middle' | 'high'): Subject[] {
    return SUBJECTS.filter(s => s.gradeLevel === grade);
}

export function getAllSubjects(): Subject[] {
    return SUBJECTS;
}

export function getSubjectColor(subjectId: string): string {
    return getSubjectById(subjectId)?.hexColor || '#9CA3AF';
}

export function getSubjectEmoji(subjectId: string): string {
    return getSubjectById(subjectId)?.emoji || '📚';
}
```

---

## 2. NOVO COMPONENTE: `src/components/dashboard/SubjectGrid.tsx`

Grid responsivo das 13 matérias:

```typescript
'use client';

import { SUBJECTS } from '@/lib/subjects';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';

interface SubjectGridProps {
    onSelectSubject: (subjectId: string) => void;
    userProgress?: Record<string, number>; // Progress %age per subject
}

export function SubjectGrid({ onSelectSubject, userProgress = {} }: SubjectGridProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
            {SUBJECTS.map((subject) => {
                const progress = userProgress[subject.id] || 0;
                const isCompleted = progress === 100;

                return (
                    <motion.div
                        key={subject.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card
                            className={`p-4 cursor-pointer transition-all ${
                                isCompleted
                                    ? 'border-2 border-green-500 bg-green-50'
                                    : 'border border-gray-200 hover:border-gray-400'
                            }`}
                            onClick={() => onSelectSubject(subject.id)}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                                        style={{
                                            backgroundColor: `${subject.hexColor}20`,
                                        }}
                                    >
                                        {subject.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {subject.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {subject.abbreviation}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>

                            {/* Progress */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">Progresso</span>
                                    <span
                                        className="font-semibold"
                                        style={{ color: subject.hexColor }}
                                    >
                                        {progress}%
                                    </span>
                                </div>
                                <Progress
                                    value={progress}
                                    className="h-1.5"
                                    style={{
                                        '--progress-bg': subject.hexColor,
                                    } as React.CSSProperties}
                                />
                            </div>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {subject.description}
                            </p>

                            {/* Badge */}
                            {isCompleted && (
                                <div className="mt-3 pt-3 border-t border-green-200">
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                                        ✓ Completo
                                    </span>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
```

---

## 3. NOVO COMPONENTE: `src/components/dashboard/StudentDashboard.tsx`

Dashboard principal do aluno:

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubjectGrid } from './SubjectGrid';
import { GamificationHUD } from '@/components/GamificationHUD';
import { Sparkles, Fire, Target, TrendingUp } from 'lucide-react';

interface StudentDashboardProps {
    userName: string;
    onSelectSubject: (subjectId: string) => void;
}

export function StudentDashboard({ userName, onSelectSubject }: StudentDashboardProps) {
    const [userProgress] = useState<Record<string, number>>({
        math: 45,
        portuguese: 32,
        science: 60,
        history: 28,
        geography: 15,
        english: 52,
        'physical-ed': 40,
        art: 35,
        music: 20,
        philosophy: 10,
        ethics: 25,
        'computer-science': 38,
        spanish: 22,
    });

    const streakDays = 7;
    const weeklyGoalsCompleted = 2;
    const totalBadges = 12;

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <GamificationHUD />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10"
            >
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Olá, {userName}! 👋
                            </h1>
                            <p className="text-muted-foreground">
                                Escolha uma matéria para começar a aprender
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                            <Fire className="w-5 h-5 text-orange-500" />
                            <span className="font-bold text-gray-900">{streakDays}</span>
                            <span className="text-xs text-muted-foreground">dias</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-medium">Metas Semanais</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {weeklyGoalsCompleted}/3
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 font-medium">Progresso Total</p>
                                <p className="text-2xl font-bold text-purple-900">35%</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-200 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-yellow-600 font-medium">Badges</p>
                                <p className="text-2xl font-bold text-yellow-900">{totalBadges}</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Subjects Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Escolha uma Matéria
                        </h2>
                        <p className="text-muted-foreground">
                            13 disciplinas com avatares especializados esperando por você
                        </p>
                    </div>

                    <SubjectGrid
                        onSelectSubject={onSelectSubject}
                        userProgress={userProgress}
                    />
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Atividade Recente
                    </h3>
                    <Card className="p-6 text-center text-muted-foreground">
                        Comece a aprender! Escolha uma matéria acima para começar sua jornada
                        educacional.
                    </Card>
                </motion.div>
            </div>
        </main>
    );
}
```

---

## 4. NOVO TIPO: `src/types/subjects.ts`

```typescript
export type GradeLevel = 'elementary' | 'middle' | 'high';

export interface Subject {
    id: string;
    name: string;
    emoji: string;
    hexColor: string;
    description: string;
    gradeLevel: GradeLevel;
    abbreviation: string;
}

export interface UserSubjectProgress {
    subjectId: string;
    completedScenarios: number;
    completedMiniGames: number;
    totalMessages: number;
    averageScore: number;
    lastInteraction: Date;
    progressPercentage: number;
}
```

---

## 5. ATUALIZAR: `src/lib/avatars.ts` (Snippet para Adicionar)

Adicione estes 10 novos avatares após os existentes:

```typescript
// ========== NOVOS AVATARES (Adicione após os 3 existentes) ==========
{
    id: 'profa-mariana',
    name: 'Profa. Mariana',
    type: 'teacher',
    subject: 'Português',
    language: 'pt-BR',
    description: 'Professora apaixonada por literatura, inspiradora e criativa',
    personality: `Você é a Profa. Mariana, uma professora de português culta e apaixonada por literatura.

Características:
- Cultured e apaixonada por livros
- Estimula criatividade
- Corrige gentilmente erros
- Faz conexões com obras famosas
- Linguagem elegante mas amigável

Estilo:
- Comece com uma pergunta interessante
- Sugira leituras quando apropriado
- Faça perguntas reflexivas
- Celebrate criatividade
- Keep responses to 2-3 frases`,
    imageUrl: '/avatars/profa-mariana.png',
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
    language: 'pt-BR',
    description: 'Professor entusiasmado que torna ciência fascinante e divertida',
    personality: `Você é o Prof. Bruno, um professor de ciências super entusiasmado!

Características:
- Muito entusiasmado
- Faz perguntas provocativas
- Relaciona teoria com prática
- Usa exemplos do dia a dia
- Energético e positivo

Estilo:
- Start with an intriguing question
- Explain step by step
- Use creative analogies
- Celebrate understanding
- 2-3 sentence responses`,
    imageUrl: '/avatars/prof-bruno.png',
    voiceConfig: {
        voiceName: 'pt-BR-Wavenet-B',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
    },
},
// ... (Continue com os outros 8 avatares)
```

---

## 6. EXEMPLO DE MINI-GAME CONFIG: `src/lib/miniGames.ts` (Início)

```typescript
import { MiniGame } from '@/types/miniGames';

export interface MiniGame {
    id: string;
    name: string;
    description: string;
    subjectId: string;
    type: 'quiz' | 'drag-drop' | 'sequence' | 'matching' | 'typing';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedDurationSeconds: number;
    maxScore: number;
    config: Record<string, any>;
}

export const MINI_GAMES: MiniGame[] = [
    // MATEMÁTICA
    {
        id: 'math-quiz-lightning',
        name: 'Quiz Relâmpago',
        description: '5 perguntas matemáticas contra o cronômetro',
        subjectId: 'math',
        type: 'quiz',
        difficulty: 'beginner',
        estimatedDurationSeconds: 300,
        maxScore: 500,
        config: {
            questionCount: 5,
            timePerQuestion: 60,
            topics: ['numbers', 'basic-operations', 'fractions'],
        },
    },
    // ... adicione mais
];

export function getMiniGamesBySubject(subjectId: string): MiniGame[] {
    return MINI_GAMES.filter(game => game.subjectId === subjectId);
}

export function getMiniGameById(id: string): MiniGame | undefined {
    return MINI_GAMES.find(game => game.id === id);
}
```

---

## 7. HOOK PARA PROGRESSO: `src/hooks/useSubjectProgress.ts`

```typescript
import { useCallback, useState } from 'react';

export function useSubjectProgress(subjectId: string) {
    const [progress, setProgress] = useState({
        messagesCount: 0,
        scenariosCompleted: 0,
        miniGamesCompleted: 0,
        totalScore: 0,
        lastInteraction: new Date(),
    });

    const updateProgress = useCallback((updates: Partial<typeof progress>) => {
        setProgress(prev => ({
            ...prev,
            ...updates,
            lastInteraction: new Date(),
        }));
    }, []);

    const getProgressPercentage = useCallback(() => {
        const maxMessages = 100;
        const maxScenarios = 10;
        const maxMiniGames = 8;
        
        const messageScore = (progress.messagesCount / maxMessages) * 33.33;
        const scenarioScore = (progress.scenariosCompleted / maxScenarios) * 33.33;
        const miniGameScore = (progress.miniGamesCompleted / maxMiniGames) * 33.34;

        return Math.min(100, Math.round(messageScore + scenarioScore + miniGameScore));
    }, [progress]);

    return {
        progress,
        updateProgress,
        progressPercentage: getProgressPercentage(),
    };
}
```

---

## 8. MIGRATION SQL (Para Executar na Semana 1)

Crie arquivo: `database/migrations/001_add_subjects.sql`

```sql
-- Adicionar tabela de matérias
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    hex_color VARCHAR(7),
    description TEXT,
    grade_level VARCHAR(20),
    abbreviation VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert todas as 13 matérias
INSERT INTO subjects (id, name, emoji, hex_color, description, grade_level, abbreviation) VALUES
('math', 'Matemática', '🔢', '#3B82F6', 'Números, geometria, álgebra', 'elementary', 'MAT'),
('portuguese', 'Português', '📖', '#10B981', 'Literatura, gramática, redação', 'elementary', 'PORT'),
('science', 'Ciências', '🔬', '#8B5CF6', 'Biologia, física, química', 'elementary', 'CIEN'),
('history', 'História', '📜', '#92400E', 'História do Brasil e mundo', 'elementary', 'HIST'),
('geography', 'Geografia', '🌍', '#06B6D4', 'Mapas, climas, culturas', 'elementary', 'GEOG'),
('english', 'Inglês', '🇬🇧', '#F97316', 'Conversação, gramática', 'elementary', 'ENG'),
('physical-ed', 'Educação Física', '⚽', '#EF4444', 'Esportes, saúde, movimento', 'elementary', 'EF'),
('art', 'Arte', '🎨', '#EC4899', 'Artes plásticas, criatividade', 'elementary', 'ARTE'),
('music', 'Música', '🎵', '#6366F1', 'Notas, ritmo, história da música', 'elementary', 'MUS'),
('philosophy', 'Filosofia', '🤔', '#6B7280', 'Ética, lógica, pensamento crítico', 'high', 'FILOS'),
('ethics', 'Religião/Ética', '☮️', '#F59E0B', 'Valores, ética, compaixão', 'elementary', 'ÉTICA'),
('computer-science', 'Informática', '💻', '#06B6D4', 'Programação, lógica', 'middle', 'INFO'),
('spanish', 'Espanhol', '🇪🇸', '#F59E0B', 'Conversação em espanhol', 'middle', 'ESP');

-- Adicionar coluna subject_id aos avatares existentes
ALTER TABLE avatars ADD COLUMN subject_id VARCHAR(50) REFERENCES subjects(id);

-- Atualizar avatares existentes
UPDATE avatars SET subject_id = 'math' WHERE name = 'Professor Carlos';
UPDATE avatars SET subject_id = 'english' WHERE name = 'Sarah';
UPDATE avatars SET subject_id = 'history' WHERE name = 'Dom Pedro II';
```

---

## Próximos Passos Esta Semana:

```
SEG:  ✅ Copiar subjects.ts
TER:  ✅ Adicionar SubjectGrid.tsx
QUA:  ✅ Criar StudentDashboard.tsx
QUI:  ✅ Executar migration SQL
SEX:  ✅ Expandir avatars.ts com 10 novos
```

---

**Todos estes componentes estão prontos para usar!** Basta copiar e colar nos arquivos indicados.
