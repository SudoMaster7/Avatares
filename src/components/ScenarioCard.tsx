'use client';

import { Scenario } from '@/lib/scenarios';
import { Clock, Target, BookOpen, PlayCircle } from 'lucide-react';

interface ScenarioCardProps {
    scenario: Scenario;
    onSelect: (scenario: Scenario) => void;
}

const difficultyConfig = {
    beginner: {
        label: 'Iniciante',
        classes: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        dot: 'bg-emerald-400',
    },
    intermediate: {
        label: 'Intermediário',
        classes: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        dot: 'bg-amber-400',
    },
    advanced: {
        label: 'Avançado',
        classes: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
        dot: 'bg-rose-400',
    },
};

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
    const diff = difficultyConfig[scenario.difficulty];

    return (
        <div
            onClick={() => onSelect(scenario)}
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/40 hover:-translate-y-0.5"
        >
            {/* Difficulty badge */}
            <div className="flex items-start justify-between mb-3 gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${diff.classes}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                    {diff.label}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {scenario.estimatedDuration} min
                </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-white text-base sm:text-lg mb-1 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                {scenario.title}
            </h3>
            <p className="text-xs text-blue-400/80 mb-2 font-medium">{scenario.category}</p>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {scenario.description}
            </p>

            {/* Learning Objectives */}
            <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-medium text-slate-500">Você vai aprender:</span>
                </div>
                <ul className="space-y-1">
                    {scenario.learningObjectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                            <span>{obj}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    {scenario.learningObjectives.length} objetivos
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    Começar
                </span>
            </div>
        </div>
    );
}
