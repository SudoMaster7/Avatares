'use client';

import { useState, useRef, useEffect } from 'react';
import { AvatarConfig } from '@/lib/avatars';
import { Scenario } from '@/lib/scenarios';
import { generateResponse, createAvatarSystemPrompt } from '@/services/groq';
import { speak, initializeTTS } from '@/services/tts';
import { useGamification } from '@/hooks/useGamification';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Volume2, Loader2, Target, Menu } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { VisualContext } from '@/components/VisualContext';
import { AudioRecorderButton } from '@/components/AudioRecorderButton';
import { ImprovedAudioRecorder } from '@/components/ImprovedAudioRecorder';
import { MicrophoneSelector } from '@/components/MicrophoneSelector';

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
    const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>('');

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
                // ElevenLabs configuration
                elevenLabsVoiceId: avatar.voiceConfig.elevenLabsVoiceId,
                elevenLabsModelId: avatar.voiceConfig.elevenLabsModelId,
                stability: avatar.voiceConfig.stability,
                similarityBoost: avatar.voiceConfig.similarityBoost,
                // Google TTS fallback
                voiceName: avatar.voiceConfig.googleVoiceName,
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

    const handleSendMessage = async (messageText?: string) => {
        const textToSend = messageText || input.trim();
        if (!textToSend || isProcessing) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        if (!messageText) setInput(''); // Only clear input if not from audio
        setIsProcessing(true);
        trackMessageSent(); // Award XP

        // Save user message
        if (conversationId) {
            saveMessage(conversationId, textToSend, 'student');
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
                    { role: 'user', content: textToSend },
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
                // ElevenLabs configuration
                elevenLabsVoiceId: avatar.voiceConfig.elevenLabsVoiceId,
                elevenLabsModelId: avatar.voiceConfig.elevenLabsModelId,
                stability: avatar.voiceConfig.stability,
                similarityBoost: avatar.voiceConfig.similarityBoost,
                // Google TTS fallback
                voiceName: avatar.voiceConfig.googleVoiceName,
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

    const handleAudioTranscription = (transcription: string) => {
        console.log('Audio transcription received in ConversationInterface:', transcription);
        
        if (!transcription || !transcription.trim()) {
            console.warn('Empty transcription received');
            return;
        }

        const cleanedTranscription = transcription.trim();
        console.log('Setting input to:', cleanedTranscription);
        
        setInput(cleanedTranscription);
        
        // Automatically send the transcribed message after a short delay
        setTimeout(() => {
            if (cleanedTranscription) {
                console.log('Auto-sending transcribed message:', cleanedTranscription);
                handleSendMessage(cleanedTranscription);
            }
        }, 100);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Removed GamificationHUD for cleaner mobile experience */}

            {/* Header with Avatar Image */}
            <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm p-3 sm:p-4 z-10">
                <div className="max-w-4xl mx-auto">
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
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-slate-700 shadow-md ring-2 ring-blue-200 dark:ring-blue-600/50 overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={avatar.imageUrl} 
                                        alt={avatar.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold hidden" id={`avatar-fallback-${avatar.id}`}>
                                        {avatar.name.charAt(0)}
                                    </div>
                                </div>
                                {scenario && (
                                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold shadow-md">
                                        <span className="hidden sm:inline">🎯 Missão</span>
                                        <span className="sm:hidden">🎯</span>
                                    </div>
                                )}
                            </div>

                            {/* Professor Info */}
                            <div className="flex-1 pt-1 sm:pt-2 min-w-0">
                                <h1 className="font-bold text-lg sm:text-2xl text-gray-900 dark:text-white leading-tight mb-1 truncate">{avatar.name}</h1>
                                <p className="text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 truncate">{avatar.subject}</p>
                                {scenario ? (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold px-2 sm:px-3 py-1 rounded-lg inline-flex max-w-full">
                                        <Target className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                                        <span className="truncate">{scenario.title}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold px-2 sm:px-3 py-1 rounded-lg max-w-fit">
                                        💬 <span className="hidden sm:inline">Conversa Livre</span><span className="sm:hidden">Livre</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Status Indicators */}
                        <div className="flex flex-col items-end gap-2 pt-1 sm:pt-2 shrink-0">
                            {isSpeaking && (
                                <div className="flex items-center gap-1 sm:gap-2 text-white bg-gradient-to-r from-green-500 to-emerald-500 px-2 sm:px-3 py-1 rounded-lg font-semibold shadow-md animate-pulse text-xs sm:text-sm">
                                    <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">Falando...</span>
                                    <span className="sm:hidden">🔊</span>
                                </div>
                            )}
                            {scenario && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 sm:gap-2 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-xs sm:text-sm px-2 sm:px-3"
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
                        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur border-b border-gray-200/50 dark:border-slate-700/50 p-2">
                            <div className="max-w-4xl mx-auto flex gap-2 sm:gap-4 overflow-x-auto text-xs text-indigo-800 dark:text-indigo-200 px-2 sm:px-4 no-scrollbar">
                                <span className="font-semibold whitespace-nowrap px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-full shrink-0">🎯 <span className="hidden sm:inline">Objetivos</span></span>
                                {scenario.learningObjectives.map((obj, i) => (
                                    <span key={i} className="whitespace-nowrap flex items-center gap-1 text-xs">
                                        <span className="w-1 h-1 rounded-full bg-indigo-400" />
                                        <span className="truncate max-w-[120px] sm:max-w-none">{obj}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 scroll-smooth bg-gradient-to-b from-transparent via-white/10 to-transparent dark:from-transparent dark:via-slate-800/10 dark:to-transparent">
                        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4 py-2 sm:py-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                    <div className={`flex flex-col max-w-[90%] sm:max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <span className={`text-xs font-semibold mb-1 sm:mb-2 px-2 ${message.role === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'
                                            }`}>
                                            {message.role === 'user' ? '👤 Você' : `👨‍🏫 ${avatar.name}`}
                                        </span>
                                        <Card
                                            className={`px-3 sm:px-4 py-2 sm:py-3 shadow-sm border-0 ${message.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md'
                                                : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-white rounded-2xl rounded-tl-md shadow-sm border border-gray-100 dark:border-slate-600'
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
                                    <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-md p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-slate-600 flex items-center gap-2 sm:gap-3">
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
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
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-t border-gray-200/50 dark:border-slate-700/50 p-3 sm:p-4 z-10 shadow-sm">
                        <div className="max-w-2xl mx-auto">
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
                                    className="flex-1 min-h-[44px] sm:min-h-[52px] max-h-[100px] sm:max-h-[120px] resize-none py-3 px-4 rounded-xl border border-gray-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-900/30 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-normal shadow-sm transition-all text-sm sm:text-base"
                                    disabled={isProcessing}
                                />
                                
                                {/* Microphone Selector */}
                                <MicrophoneSelector
                                    onDeviceSelect={setSelectedMicrophoneId}
                                />
                                
                                {/* Improved Audio Recording Button */}
                                <ImprovedAudioRecorder
                                    onTranscriptionComplete={handleAudioTranscription}
                                    disabled={isProcessing}
                                    selectedDeviceId={selectedMicrophoneId}
                                />
                                
                                {/* Fallback: Original Audio Recording Button (kept for backup) */}
                                {/*
                                <AudioRecorderButton
                                    onTranscriptionComplete={handleAudioTranscription}
                                    disabled={isProcessing}
                                    selectedDeviceId={selectedMicrophoneId}
                                />
                                */}
                                
                                <Button
                                    onClick={() => handleSendMessage()}
                                    disabled={!input.trim() || isProcessing}
                                    size="icon"
                                    className="h-11 w-11 sm:h-13 sm:w-13 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shrink-0 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-2 font-medium">
                                <span>🎙️ <span className="hidden sm:inline">Voz IA Ativada</span><span className="sm:hidden">Voz IA</span></span>
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span>📱 <span className="hidden sm:inline">Grave áudio ou digite</span><span className="sm:hidden">Áudio/Texto</span></span>
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span className="hidden sm:inline">⚙️ Selecione o microfone</span>
                                <span className="sm:hidden">⚙️ Mic</span>
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
