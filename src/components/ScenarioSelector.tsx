'use client';

import { useState } from 'react';
import { AvatarConfig } from '@/lib/avatars';
import { Scenario, getScenariosByAvatar } from '@/lib/scenarios';
import { ScenarioCard } from './ScenarioCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface ScenarioSelectorProps {
    avatar: AvatarConfig;
    onSelectScenario: (scenario: Scenario) => void;
    onBack: () => void;
}

const DIFFICULTIES = [
    { key: 'all',          label: 'Todos'         },
    { key: 'beginner',     label: 'Iniciante'     },
    { key: 'intermediate', label: 'Intermediário' },
    { key: 'advanced',     label: 'Avançado'      },
] as const;

export function ScenarioSelector({ avatar, onSelectScenario, onBack }: ScenarioSelectorProps) {
    const scenarios = getScenariosByAvatar(avatar.id);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

    const filteredScenarios = selectedDifficulty === 'all'
        ? scenarios
        : scenarios.filter(s => s.difficulty === selectedDifficulty);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="mb-4 text-slate-300 hover:text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Cenários Práticos
                        </h1>
                    </div>
                    <p className="text-slate-400 ml-1">
                        Escolha um cenário para praticar com <span className="text-blue-400 font-medium">{avatar.name}</span>
                    </p>
                </div>

                {/* Difficulty Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {DIFFICULTIES.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setSelectedDifficulty(key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                selectedDifficulty === key
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Scenarios Grid */}
                {filteredScenarios.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredScenarios.map((scenario) => (
                            <ScenarioCard
                                key={scenario.id}
                                scenario={scenario}
                                onSelect={onSelectScenario}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-slate-400 text-lg">
                            Nenhum cenário encontrado para este nível.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
