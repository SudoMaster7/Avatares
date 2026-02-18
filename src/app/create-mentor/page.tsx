"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen, Clock, Brain } from "lucide-react";

interface PersonaProfile {
    name: string;
    contextoTemporal: string;
    personalidade: string;
    limitacaoConhecimento: string;
    missaoEducativa: string;
    systemPrompt: string;
}

function CreateMentorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoRef = searchParams.get("video_ref");

    const [characterName, setCharacterName] = useState("");
    const [loading, setLoading] = useState(false);
    const [persona, setPersona] = useState<PersonaProfile | null>(null);
    const [error, setError] = useState("");

    const handleMaterialize = async () => {
        if (!characterName.trim()) return;

        setLoading(true);
        setError("");
        setPersona(null);

        try {
            const response = await fetch("/api/create-avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    characterName,
                    videoRef
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate persona");
            }

            const data = await response.json();
            setPersona(data);
        } catch (err) {
            setError("Falha ao materializar o mentor. Tente novamente.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startJourney = () => {
        if (!persona) return;

        // Store the system prompt in sessionStorage or pass via URL state (encoding large text in URL is risky)
        // For now, let's use sessionStorage as a simple bridge
        sessionStorage.setItem("current_mentor_prompt", persona.systemPrompt);

        // Redirect to chat
        router.push(`/chat?personagem=${encodeURIComponent(persona.name)}&custom=true`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">
                    Crie seu Mentor do Tempo
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Digite o nome de qualquer figura histórica e nossa IA irá reconstruir sua personalidade,
                    memórias e missão para uma conversa única.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                <Input
                    placeholder="Ex: Marie Curie, Ayrton Senna, Machado de Assis..."
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white h-12 text-lg"
                    onKeyDown={(e) => e.key === "Enter" && handleMaterialize()}
                />
                <Button
                    onClick={handleMaterialize}
                    disabled={loading || !characterName.trim()}
                    className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-black font-bold"
                >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Materializar
                </Button>
            </div>

            {error && (
                <p className="text-red-400 text-center">{error}</p>
            )}

            {persona && (
                <div className="max-w-2xl mx-auto mt-12 animate-in zoom-in duration-300">
                    <Card className="bg-gray-900 border-amber-500/30 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <CardHeader className="border-b border-gray-800">
                            <CardTitle className="text-2xl text-amber-100">{persona.name}</CardTitle>
                            <CardDescription className="flex items-center text-amber-500/80">
                                <Clock className="w-4 h-4 mr-2" />
                                {persona.contextoTemporal}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center">
                                    <Brain className="w-4 h-4 mr-2" /> Personalidade
                                </h3>
                                <p className="text-gray-200">{persona.personalidade}</p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider flex items-center">
                                    <BookOpen className="w-4 h-4 mr-2" /> Missão de Hoje
                                </h3>
                                <p className="text-gray-200 italic">"{persona.missaoEducativa}"</p>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-950/50 border-t border-gray-800 p-6 flex justify-end">
                            <Button
                                onClick={startJourney}
                                size="lg"
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20"
                            >
                                Iniciar Viagem no Tempo
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default function CreateMentorPage() {
    return (
        <Suspense fallback={<div className="text-center py-12 text-gray-400">Carregando...</div>}>
            <CreateMentorContent />
        </Suspense>
    );
}
