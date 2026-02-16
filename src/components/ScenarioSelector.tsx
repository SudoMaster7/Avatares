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

export function ScenarioSelector({ avatar, onSelectScenario, onBack }: ScenarioSelectorProps) {
    const scenarios = getScenariosByAvatar(avatar.id);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

    const filteredScenarios = selectedDifficulty === 'all'
        ? scenarios
        : scenarios.filter(s => s.difficulty === selectedDifficulty);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" onClick={onBack} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                        <h1 className="text-3xl font-bold">Cenários Práticos</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Escolha um cenário para praticar com {avatar.name}
                    </p>
                </div>

                {/* Difficulty Filter */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('all')}
                        size="sm"
                    >
                        Todos
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('beginner')}
                        size="sm"
                    >
                        Iniciante
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('intermediate')}
                        size="sm"
                    >
                        Intermediário
                    </Button>
                    <Button
                        variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty('advanced')}
                        size="sm"
                    >
                        Avançado
                    </Button>
                </div>

                {/* Scenarios Grid */}
                {filteredScenarios.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredScenarios.map((scenario) => (
                            <ScenarioCard
                                key={scenario.id}
                                scenario={scenario}
                                onSelect={onSelectScenario}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Nenhum cenário encontrado para este nível.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
