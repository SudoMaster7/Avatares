export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    xp: number;
    level: number;
    messagesSent: number;
    scenariosCompleted: number;
    daysStreak: number;
    lastLoginDate: string;
    unlockedAchievements: string[];
}

export const LEVELS = [
    { level: 1, xp: 0, title: 'Novato' },
    { level: 2, xp: 100, title: 'Aprendiz' },
    { level: 3, xp: 300, title: 'Estudioso' },
    { level: 4, xp: 600, title: 'Dedicado' },
    { level: 5, xp: 1000, title: 'Expert' },
    { level: 10, xp: 5000, title: 'Mestre' },
];

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-step',
        title: 'Primeiros Passos',
        description: 'Envie sua primeira mensagem',
        icon: '🦶',
        condition: (stats) => stats.messagesSent >= 1,
    },
    {
        id: 'talkative',
        title: 'Falador',
        description: 'Envie 50 mensagens',
        icon: '🗣️',
        condition: (stats) => stats.messagesSent >= 50,
    },
    {
        id: 'scholar',
        title: 'Estudioso',
        description: 'Complete 3 cenários',
        icon: '🎓',
        condition: (stats) => stats.scenariosCompleted >= 3,
    },
    {
        id: 'dedicated',
        title: 'Dedicado',
        description: 'Estude por 3 dias seguidos',
        icon: '🔥',
        condition: (stats) => stats.daysStreak >= 3,
    },
];

export function calculateLevel(xp: number) {
    return LEVELS.slice().reverse().find(l => xp >= l.xp) || LEVELS[0];
}
