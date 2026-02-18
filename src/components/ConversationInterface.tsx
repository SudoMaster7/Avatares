'use client';

import { useState, useRef, useEffect } from 'react';
import { AvatarConfig } from '@/lib/avatars';
import { Scenario } from '@/lib/scenarios';
import { generateResponse, createAvatarSystemPrompt, ChatApiResponse } from '@/services/groq';
import { speak, initializeTTS, speakWithWebSpeech, speakWithGoogleTTS, speakWithElevenLabs } from '@/services/tts';
import { useGamification } from '@/hooks/useGamification';
import { usePlan } from '@/hooks/usePlan';
import { useToast } from '@/components/Toast';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Volume2, Loader2, Target, Menu, Crown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { VisualContext } from '@/components/VisualContext';
import { AudioRecorderButton } from '@/components/AudioRecorderButton';
import { ImprovedAudioRecorder } from '@/components/ImprovedAudioRecorder';
import { MicrophoneSelector } from '@/components/MicrophoneSelector';
import { TokenScarcityIndicator, QualityBanner } from '@/components/PersuasiveUpsells';
import { AuthDialog } from '@/components/AuthDialog';

import { initializeGuestSession } from '@/services/auth-service';
import { getOrCreateConversation, saveMessage, loadConversationHistory } from '@/services/history';

// ── Free voice limit — first N responses use ElevenLabs, then Web Speech ──────────────
const FREE_VOICE_LIMIT = 10;

function getVoicesUsed(uid: string | null): number {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(`sudo_fv_${uid ?? 'guest'}`) ?? '0', 10);
}
function incrementVoicesUsed(uid: string | null): number {
    const next = getVoicesUsed(uid) + 1;
    localStorage.setItem(`sudo_fv_${uid ?? 'guest'}`, String(next));
    return next;
}

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
    customSystemPrompt?: string;
}

export function ConversationInterface({ avatar, scenario, onBack, customSystemPrompt }: ConversationInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [showVisualContext, setShowVisualContext] = useState(true);
    const [userId, setUserId] = useState<string | null | undefined>(undefined); // undefined = loading
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [voicesUsed, setVoicesUsed] = useState(0);

    const { trackMessageSent, trackScenarioCompleted } = useGamification();
    const planState = usePlan(userId ?? null);
    const { warning, info } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // Load voice counter from localStorage when user is known
    useEffect(() => {
        if (userId !== undefined) setVoicesUsed(getVoicesUsed(userId ?? null));
    }, [userId]);

    // Get user ID on mount - wait for session, then subscribe to changes
    useEffect(() => {
        const fetchUserId = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUserId(session?.user?.id ?? null);
        };
        fetchUserId();

        // Subscribe to auth changes (e.g. user logs in from AuthDialog)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null);
            // Reset plan data on auth change
            planState.refresh?.();
        });
        return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initialize services - wait until we know the auth state
    useEffect(() => {
        // userId is still loading (undefined) - wait
        if (userId === undefined) return;
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
            const systemPrompt = customSystemPrompt || createAvatarSystemPrompt(
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

            const apiResponse = await generateResponse({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...conversationHistory,
                    { role: 'user', content: textToSend },
                ],
                userId: userId ?? null,
                avatarId: avatar.id,
                userMessage: textToSend,
            });

            // Handle upgrade/signup prompts
            if (apiResponse.error) {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: apiResponse.error,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, errorMessage]);
                
                // Show AuthDialog if signup is needed
                if (apiResponse.showSignupModal || apiResponse.demoComplete) {
                    setTimeout(() => setShowAuthDialog(true), 500);
                }
                
                // Refresh plan state after error
                planState.refresh();
                setIsProcessing(false);
                return;
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: apiResponse.content,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Save assistant message
            if (conversationId) {
                saveMessage(conversationId, apiResponse.content, 'avatar');
            }

            // Refresh plan state to update token count
            planState.refresh();

            // Speak response - use TTS based on plan
            setIsSpeaking(true);
            const ttsType = apiResponse.meta?.ttsType;
            
            if (ttsType === 'elevenlabs' && avatar.voiceConfig.elevenLabsVoiceId) {
                // Pro users get ElevenLabs (best quality)
                await speak({
                    text: apiResponse.content,
                    language: avatar.language,
                    elevenLabsVoiceId: avatar.voiceConfig.elevenLabsVoiceId,
                    elevenLabsModelId: avatar.voiceConfig.elevenLabsModelId,
                    stability: avatar.voiceConfig.stability,
                    similarityBoost: avatar.voiceConfig.similarityBoost,
                });
            } else if (ttsType === 'lemonfox' || ttsType === 'google') {
                const currentlyUsed = getVoicesUsed(userId ?? null);
                if (currentlyUsed < FREE_VOICE_LIMIT && avatar.voiceConfig.elevenLabsVoiceId) {
                    // First 10 falas: ElevenLabs (melhor qualidade)
                    try {
                        await speakWithElevenLabs({
                            text: apiResponse.content,
                            language: avatar.language,
                            elevenLabsVoiceId: avatar.voiceConfig.elevenLabsVoiceId,
                            elevenLabsModelId: avatar.voiceConfig.elevenLabsModelId,
                            stability: avatar.voiceConfig.stability,
                            similarityBoost: avatar.voiceConfig.similarityBoost,
                        });
                        const newCount = incrementVoicesUsed(userId ?? null);
                        setVoicesUsed(newCount);
                        const remaining = FREE_VOICE_LIMIT - newCount;
                        if (remaining === 0) {
                            info('🎤 Seus 10 créditos de voz premium acabaram! Continuando com Google Neural2.', 5000);
                        } else if (remaining <= 3) {
                            info(`⚠️ Apenas ${remaining} crédito${remaining === 1 ? '' : 's'} de voz premium restante${remaining === 1 ? '' : 's'}.`, 4000);
                        }
                    } catch {
                        // ElevenLabs falhou: usar Google Neural2
                        await speakWithGoogleTTS({
                            text: apiResponse.content,
                            language: avatar.language ?? 'pt-BR',
                            preferFemale: avatar.voiceConfig.pitch ? avatar.voiceConfig.pitch > 1.0 : true,
                            speakingRate: avatar.voiceConfig.rate ?? 0.95,
                        }).catch(() => speakWithWebSpeech({ text: apiResponse.content, language: avatar.language ?? 'pt-BR' }));
                    }
                } else {
                    // Limite atingido: Google Neural2 ilimitado
                    try {
                        await speakWithGoogleTTS({
                            text: apiResponse.content,
                            language: avatar.language ?? 'pt-BR',
                            preferFemale: avatar.voiceConfig.pitch ? avatar.voiceConfig.pitch > 1.0 : true,
                            speakingRate: avatar.voiceConfig.rate ?? 0.95,
                        });
                    } catch {
                        await speakWithWebSpeech({
                            text: apiResponse.content,
                            language: avatar.language ?? 'pt-BR',
                            preferFemale: avatar.voiceConfig.pitch ? avatar.voiceConfig.pitch > 1.0 : undefined,
                        });
                    }
                }
            }
            // Guest users (ttsType === null) get no TTS
            
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

            {/* Quality & Token Status Bar */}
            {!planState.isLoading && !planState.isPro && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-200/50 dark:border-amber-700/50 px-4 py-2">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                        <QualityBanner currentQuality={planState.modelQuality} />
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Voice credit counter */}
                            {(() => {
                                const remaining = FREE_VOICE_LIMIT - voicesUsed;
                                if (remaining <= 0) return (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 px-2 py-0.5 rounded-full">
                                        🎤 Neural2 ativo
                                    </span>
                                );
                                const pct = remaining / FREE_VOICE_LIMIT;
                                const color = pct <= 0.3
                                    ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                                    : pct <= 0.5
                                    ? 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700'
                                    : 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700';
                                return (
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold border px-2 py-0.5 rounded-full ${color}`}>
                                        🎤 <strong>{remaining}</strong>/{FREE_VOICE_LIMIT} vozes premium
                                    </span>
                                );
                            })()}
                            <Button
                                size="sm"
                                className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold px-3 py-1 h-auto"
                                onClick={() => window.location.href = '/planos'}
                            >
                                <Crown className="w-3 h-3 mr-1" />
                                Upgrade
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                                            <span className="hidden sm:inline">{avatar.language === 'en' ? 'Teacher is thinking...' : 'Professor está pensando...'}</span>
                                            <span className="sm:hidden">{avatar.language === 'en' ? 'Thinking...' : 'Pensando...'}</span>
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

                                {/* Audio Recording Button */}
                                <ImprovedAudioRecorder
                                    onTranscriptionComplete={handleAudioTranscription}
                                    disabled={isProcessing}
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
                                    disabled={!input.trim() || isProcessing || !planState.canSendMessage}
                                    size="icon"
                                    className="h-11 w-11 sm:h-13 sm:w-13 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shrink-0 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </div>
                            
                            {/* Google Neural2 info badge for free users */}
                            {planState.plan === 'free' && (
                                <div className="mt-2 p-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between gap-2">
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                        🎤 Voz Neural2 ativa — qualidade premium no plano gratuíto
                                    </p>
                                    <button
                                        onClick={() => window.location.href = '/planos'}
                                        className="text-xs text-green-700 dark:text-green-400 underline font-semibold shrink-0"
                                    >
                                        Pro
                                    </button>
                                </div>
                            )}

                            {/* Token exhausted warning */}
                            {!planState.canSendMessage && !planState.isPro && (
                                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                        ⚠️ Seus tokens acabaram! 
                                        <button 
                                            onClick={() => window.location.href = '/planos'}
                                            className="ml-2 underline font-bold hover:text-red-700"
                                        >
                                            Faça upgrade para Pro
                                        </button>
                                    </p>
                                </div>
                            )}

                            {/* Guest auth prompt */}
                            {userId === null && planState.isGuest && (
                                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                        🔒 Crie uma conta grátis para desbloquear todos os personagens!
                                    </p>
                                    <button
                                        onClick={() => setShowAuthDialog(true)}
                                        className="mt-1 text-sm font-bold text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
                                    >
                                        Criar conta / Entrar
                                    </button>
                                </div>
                            )}
                            
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-2 font-medium">
                                <span>🎙️ <span className="hidden sm:inline">Voz IA Ativada</span><span className="sm:hidden">Voz IA</span></span>
                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                <span>📱 <span className="hidden sm:inline">{avatar.language === 'en' ? 'Record audio or type' : 'Grave áudio ou digite'}</span><span className="sm:hidden">{avatar.language === 'en' ? 'Audio/Text' : 'Áudio/Texto'}</span></span>
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

            {/* Auth Dialog for guests */}
            <AuthDialog 
                open={showAuthDialog} 
                onOpenChange={setShowAuthDialog}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
}
