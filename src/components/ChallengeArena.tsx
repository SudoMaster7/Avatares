'use client';

import { useState } from 'react';
import { generateQuiz, QuizQuestion } from '@/services/groq';
import { useGamification } from '@/hooks/useGamification';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, Trophy, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface ChallengeArenaProps {
    onBack: () => void;
}

export function ChallengeArena({ onBack }: ChallengeArenaProps) {
    const [topic, setTopic] = useState<string>('');
    const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const { trackChallengeCompleted } = useGamification();

    const handleStartQuiz = async () => {
        if (!topic) {
            toast.error('Por favor, escolha um tópico.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await generateQuiz(topic, difficulty);
            setQuestions(data);
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResults(false);
            setIsAnswered(false);
            setSelectedAnswer(null);
        } catch (error) {
            toast.error('Erro ao gerar desafio. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (index: number) => {
        if (isAnswered) return;

        setSelectedAnswer(index);
        setIsAnswered(true);

        const isCorrect = index === questions[currentQuestionIndex].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setIsAnswered(false);
                setSelectedAnswer(null);
            } else {
                finishQuiz(isCorrect ? score + 1 : score);
            }
        }, 2000);
    };

    const finishQuiz = (finalScore: number) => {
        setShowResults(true);
        trackChallengeCompleted(finalScore);
    };

    // Configuration Screen
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Arena de Desafios</h2>
                        <p className="text-gray-600 mt-2">Teste seus conhecimentos e ganhe XP!</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tópico</label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            >
                                <option value="">Selecione um tópico...</option>
                                <option value="Inglês Básico">Inglês Básico</option>
                                <option value="Matemática">Matemática</option>
                                <option value="História do Brasil">História do Brasil</option>
                                <option value="Ciências">Ciências</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldade</label>
                            <div className="flex gap-2">
                                {['beginner', 'intermediate', 'advanced'].map((level) => (
                                    <Button
                                        key={level}
                                        variant={difficulty === level ? 'default' : 'outline'}
                                        onClick={() => setDifficulty(level as any)}
                                        className="flex-1 capitalize"
                                    >
                                        {level === 'beginner' ? 'Fácil' : level === 'intermediate' ? 'Médio' : 'Difícil'}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6"
                            size="lg"
                            onClick={handleStartQuiz}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
                            Gerar Desafio
                        </Button>

                        <Button variant="ghost" className="w-full" onClick={onBack}>
                            Voltar
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Results Screen
    if (showResults) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md p-8 text-center animate-in zoom-in-50">
                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Desafio Concluído!</h2>
                    <p className="text-xl text-indigo-600 font-semibold mb-6">
                        Você acertou {score} de {questions.length} questões
                    </p>

                    <div className="bg-indigo-50 p-4 rounded-lg mb-8">
                        <p className="text-sm text-gray-600">XP Ganho</p>
                        <p className="text-2xl font-bold text-indigo-700">+{score * 50 + (score === 3 ? 100 : 0)} XP</p>
                    </div>

                    <div className="space-y-2">
                        <Button className="w-full" onClick={() => setQuestions([])}>
                            Novo Desafio
                        </Button>
                        <Button variant="outline" className="w-full" onClick={onBack}>
                            Voltar ao Início
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Quiz Interface
    const question = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="mb-6 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Questão {currentQuestionIndex + 1} de {questions.length}</span>
                    <span className="text-sm font-medium text-indigo-600">{topic} • {difficulty}</span>
                </div>

                <Card className="p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>

                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            let buttonStyle = "w-full justify-start text-left p-4 h-auto text-lg hover:bg-indigo-50";
                            let icon = null;

                            if (isAnswered) {
                                if (index === question.correctAnswer) {
                                    buttonStyle = "w-full justify-start text-left p-4 h-auto text-lg bg-green-100 hover:bg-green-100 border-green-500 text-green-800";
                                    icon = <CheckCircle2 className="w-5 h-5 ml-auto text-green-600" />;
                                } else if (index === selectedAnswer) {
                                    buttonStyle = "w-full justify-start text-left p-4 h-auto text-lg bg-red-100 hover:bg-red-100 border-red-500 text-red-800";
                                    icon = <XCircle className="w-5 h-5 ml-auto text-red-600" />;
                                } else {
                                    buttonStyle = "w-full justify-start text-left p-4 h-auto text-lg opacity-50";
                                }
                            }

                            return (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className={buttonStyle}
                                    onClick={() => handleAnswer(index)}
                                    disabled={isAnswered}
                                >
                                    <span className="mr-4 font-bold text-gray-400">{String.fromCharCode(65 + index)}.</span>
                                    {option}
                                    {icon}
                                </Button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                            <p className="font-semibold text-blue-800 mb-1">Explicação:</p>
                            <p className="text-blue-700">{question.explanation}</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
