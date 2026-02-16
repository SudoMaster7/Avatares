// Todas as 13 matérias do colégio com metadados
export interface Subject {
    id: string;
    name: string;
    emoji: string;
    hexColor: string;
    description: string;
    gradeLevel: 'elementary' | 'middle' | 'high';
    abbreviation: string;
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

export function getSubjectName(subjectId: string): string {
    return getSubjectById(subjectId)?.name || 'Desconhecida';
}
