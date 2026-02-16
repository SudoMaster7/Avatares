'use client';

import { useState, useRef, useEffect } from 'react';
import { AvatarConfig } from '@/lib/avatars';
import { Scenario } from '@/lib/scenarios';
import { generateResponse, createAvatarSystemPrompt } from '@/services/groq';
import { speak, initializeTTS } from '@/services/tts';
import { useGamification } from '@/hooks/useGamification';
import { GamificationHUD } from '@/components/GamificationHUD';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Volume2, Loader2, Target, Menu } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { VisualContext } from '@/components/VisualContext';

import { initializeGuestSession } from '@/services/auth-service';
import { getOrCreateConversation, saveMessage, loadConversationHistory } from '@/services/history';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ConversationInterfaceProps {
    avatar: AvatarConfig;
    scenario?: Scenario | null;
    onBack: () => void;
}

export function ConversationInterface({ avatar, scenario, onBack }: ConversationInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [showVisualContext, setShowVisualContext] = useState(true);

    const { trackMessageSent, trackScenarioCompleted } = useGamification();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // Initialize services
    useEffect(() => {
        // Prevent double execution in React Strict Mode
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const init = async () => {
            await initializeTTS();

            // 1. Initialize Guest Session
            await initializeGuestSession();

            // 2. Get or Create Conversation
            const convId = await getOrCreateConversation(avatar.id, scenario?.id);
            setConversationId(convId);

            // 3. Load History
            if (convId) {
                const history = await loadConversationHistory(convId);
                if (history && history.length > 0) {
                    setMessages(history.map((msg: any) => ({
                        id: msg.id,
                        role: msg.sender_type === 'student' ? 'user' : 'assistant',
                        content: msg.content,
                        timestamp: new Date(msg.created_at),
                    })));
                    return; // Don't show welcome message if history exists
                }
            }

            // Initial message (Welcome or Scenario start)
            let initialContent = '';
            if (scenario) {
                initialContent = scenario.initialPrompt;
            } else {
                initialContent = avatar.language === 'pt-BR'
                    ? `Olá! Eu sou ${avatar.name}. Como posso ajudar você hoje?`
                    : `Hello! I'm ${avatar.name}. How can I help you today?`;
            }

            const welcomeMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: initialContent,
                timestamp: new Date(),
            };
            setMessages([welcomeMessage]);

            // Save welcome message if new conversation
            if (convId) {
                saveMessage(convId, initialContent, 'avatar');
            }

            // Speak welcome message
            speak({
                text: welcomeMessage.content,
                language: avatar.language,
                voiceName: avatar.voiceConfig.voiceName,
            });
        };
        init();
    }, [avatar, scenario]);

    // Track scenario completion
    useEffect(() => {
        if (scenario) {
            const userMessageCount = messages.filter(m => m.role === 'user').length;
            if (userMessageCount === 10) {
                trackScenarioCompleted();
            }
        }
    }, [messages, scenario, trackScenarioCompleted]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);
        trackMessageSent(); // Award XP

        // Save user message
        if (conversationId) {
            saveMessage(conversationId, input, 'student');
        }

        try {
            // Generate AI response
            const systemPrompt = createAvatarSystemPrompt(
                avatar.name,
                avatar.personality,
                avatar.subject,
                avatar.language,
                scenario || undefined
            );

            const conversationHistory = messages.map(m => ({
                role: m.role === 'user' ? 'user' as const : 'assistant' as const,
                content: m.content,
            }));

            const response = await generateResponse({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...conversationHistory,
                    { role: 'user', content: input },
                ],
            });

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Save assistant message
            if (conversationId) {
                saveMessage(conversationId, response, 'avatar');
            }

            // Speak response
            setIsSpeaking(true);
            await speak({
                text: response,
                language: avatar.language,
                voiceName: avatar.voiceConfig.voiceName,
            });
            setIsSpeaking(false);
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Desculpe, ocorreu um erro. Tente novamente.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
            <GamificationHUD />

            {/* Header with Avatar Image */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-lg p-3 sm:p-6 z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start justify-between gap-3 sm:gap-6">
                        {/* Left: Avatar Image + Info */}
                        <div className="flex items-start gap-3 sm:gap-6 flex-1 min-w-0">
                            <Button 
                                variant="ghost" 
                                onClick={onBack}
                                className="hover:bg-gray-100 dark:hover:bg-slate-700 self-center px-2 sm:px-4 text-sm sm:text-base shrink-0"
                            >
                                ← <span className="hidden sm:inline">Voltar</span>
                            </Button>
                            
                            {/* Avatar Image */}
                            <div className="relative shrink-0">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-700 shadow-xl ring-2 sm:ring-4 ring-blue-300 dark:ring-blue-600 overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={avatar.imageUrl} 
                                        alt={avatar.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold hidden" id={`avatar-fallback-${avatar.id}`}>
                                        {avatar.name.charAt(0)}
                                    </div>
                                </div>
                                {scenario && (
                                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg">
                                        <span className="hidden sm:inline">🎯 Missão</span>
                                        <span className="sm:hidden">🎯</span>
                                    </div>
                                )}
                            </div>

                            {/* Professor Info */}
                            <div className="flex-1 pt-1 sm:pt-2 min-w-0">
                                <h1 className="font-black text-xl sm:text-3xl text-gray-900 dark:text-white leading-tight mb-1 truncate">{avatar.name}</h1>
                                <p className="text-sm sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3 truncate">{avatar.subject}</p>
                                {scenario ? (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-2 sm:px-3 py-1 rounded-lg inline-flex max-w-full">
                                        <Target className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                        <span className="truncate">{scenario.title}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold px-2 sm:px-3 py-1 rounded-lg max-w-fit">
                                        💬 <span className="hidden sm:inline">Conversa Livre</span><span className="sm:hidden">Livre</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Status Indicators */}
                        <div className="flex flex-col items-end gap-2 sm:gap-3 pt-1 sm:pt-2 shrink-0">
                            {isSpeaking && (
                                <div className="flex items-center gap-1 sm:gap-2 text-white bg-gradient-to-r from-green-500 to-emerald-500 px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold shadow-lg animate-pulse text-xs sm:text-sm">
                                    <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Falando...</span>
                                    <span className="sm:hidden">🔊</span>
                                </div>
                            )}
                            {scenario && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 sm:gap-2 border-2 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs sm:text-sm px-2 sm:px-3"
                                    onClick={() => setShowVisualContext(!showVisualContext)}
                                >
                                    <Menu className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden lg:inline">{showVisualContext ? 'Ocultar Contexto' : 'Mostrar Contexto'}</span>
                                    <span className="lg:hidden">{showVisualContext ? 'Ocultar' : 'Contexto'}</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Scenario Objectives */}
                    {scenario && (
                        <div className="bg-white/50 backdrop-blur border-b p-2">
                            <div className="max-w-4xl mx-auto flex gap-2 sm:gap-4 overflow-x-auto text-xs text-purple-800 px-2 sm:px-4 no-scrollbar">
                                <span className="font-semibold whitespace-nowrap px-2 py-0.5 bg-purple-100 rounded-full shrink-0">🎯 <span className="hidden sm:inline">Objetivos</span></span>
                                {scenario.learningObjectives.map((obj, i) => (
                                    <span key={i} className="whitespace-nowrap flex items-center gap-1 text-xs">
                                        <span className="w-1 h-1 rounded-full bg-purple-400" />
                                        <span className="truncate max-w-[120px] sm:max-w-none">{obj}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-6 scroll-smooth bg-gradient-to-b from-white/50 to-transparent dark:from-slate-800/50">
                        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 py-2 sm:py-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                    <div className={`flex flex-col max-w-[90%] sm:max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <span className={`text-xs uppercase font-extrabold mb-1 sm:mb-2 px-2 tracking-wider ${message.role === 'user' ? 'text-blue-600 dark:text-blue-300' : 'text-purple-600 dark:text-purple-300'
                                            }`}>
                                            {message.role === 'user' ? '👤 Você' : `👨‍🏫 ${avatar.name}`}
                                        </span>
                                        <Card
                                            className={`px-3 sm:px-5 py-2 sm:py-3 shadow-md border-0 ${message.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-3xl rounded-tr-lg shadow-blue-200 dark:shadow-blue-900'
                                                : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white rounded-3xl rounded-tl-lg shadow-gray-200 dark:shadow-slate-900'
                                                }`}
                                        >
                                            <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed font-medium">
                                                {message.content}
                                            </p>
                                        </Card>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 px-2 font-semibold">
                                            {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isProcessing && (
                                <div className="flex justify-start animate-fade-in">
                                    <div className="bg-white dark:bg-slate-700 rounded-3xl rounded-tl-lg p-3 sm:p-4 shadow-md flex items-center gap-2 sm:gap-3">
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-purple-600 dark:text-purple-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                                            <span className="hidden sm:inline">Professor está pensando...</span>
                                            <span className="sm:hidden">Pensando...</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="bg-gradient-to-t from-white to-white/80 dark:from-slate-800 dark:to-slate-800/80 border-t border-gray-200 dark:border-slate-700 backdrop-blur-sm p-3 sm:p-6 z-10 shadow-xl">
                        <div className="max-w-3xl mx-auto">
                            <div className="relative flex gap-2 sm:gap-3 items-end">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder={avatar.language === 'pt-BR' ? '✍️ Digite sua resposta...' : 'Type your answer...'}
                                    className="flex-1 min-h-[48px] sm:min-h-[56px] max-h-[120px] sm:max-h-[140px] resize-none py-3 sm:py-4 px-3 sm:px-5 rounded-2xl border-2 border-gray-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 focus:ring-blue-100 dark:focus:ring-blue-900/30 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium shadow-sm transition-all text-sm sm:text-base"
                                    disabled={isProcessing}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isProcessing}
                                    size="icon"
                                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shrink-0 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                                >
                                    {isProcessing ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 sm:mt-3 flex items-center justify-center gap-2 font-semibold">
                                <span>🎙️ <span className="hidden sm:inline">Voz IA Ativada</span><span className="sm:hidden">Voz IA</span></span>
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span className="hidden sm:inline">Pressione Enter para enviar</span>
                                <span className="sm:hidden">Enter = Enviar</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side Visual Context - Hidden on mobile */}
                {scenario && (
                    <div className={`${showVisualContext ? 'block' : 'hidden'} lg:block`}>
                        <VisualContext
                            scenarioId={scenario.id}
                            isVisible={showVisualContext}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
