'use client';

import { Scenario } from '@/lib/scenarios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Target, BookOpen } from 'lucide-react';

interface ScenarioCardProps {
    scenario: Scenario;
    onSelect: (scenario: Scenario) => void;
}

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
};

const difficultyLabels = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
};

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                    <div className="flex-1">
                        <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {scenario.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                            {scenario.category}
                        </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${difficultyColors[scenario.difficulty]}`}>
                        {difficultyLabels[scenario.difficulty]}
                    </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                    {scenario.description}
                </p>

                {/* Info */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{scenario.estimatedDuration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{scenario.learningObjectives.length} objetivos</span>
                    </div>
                </div>

                {/* Learning Objectives */}
                <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Você vai aprender:</span>
                    </div>
                    <ul className="space-y-1">
                        {scenario.learningObjectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{objective}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Button */}
                <Button
                    onClick={() => onSelect(scenario)}
                    className="w-full"
                    variant="default"
                >
                    Começar Cenário
                </Button>
            </div>
        </Card>
    );
}
