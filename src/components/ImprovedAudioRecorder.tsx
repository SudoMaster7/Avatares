'use client';

import { useState } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { useSimpleRecorder } from '@/hooks/useSimpleRecorder';
import { cn } from '@/lib/utils';

interface ImprovedAudioRecorderProps {
    onTranscriptionComplete: (text: string) => void;
    disabled?: boolean;
    className?: string;
    selectedDeviceId?: string;
}

export function ImprovedAudioRecorder({ 
    onTranscriptionComplete, 
    disabled,
    className,
    selectedDeviceId
}: ImprovedAudioRecorderProps) {
    const [showRecording, setShowRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastTranscription, setLastTranscription] = useState<string>('');
    
    const {
        isRecording,
        isTranscribing,
        recordingDuration,
        currentTranscript,
        startRecording,
        stopRecording,
        cancelRecording,
        isAvailable,
        serviceInfo,
    } = useSimpleRecorder();

    // Update last transcription when current changes
    React.useEffect(() => {
        if (currentTranscript && currentTranscript.trim()) {
            setLastTranscription(currentTranscript);
        }
    }, [currentTranscript]);

    const handleStartRecording = async () => {
        try {
            setError(null);
            console.log('Initiating recording...');
            await startRecording(selectedDeviceId);
            setShowRecording(true);
            console.log('Recording started successfully');
        } catch (error) {
            console.error('Failed to start recording:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao iniciar gravação';
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const handleStopRecording = async () => {
        try {
            console.log('User requesting to stop recording...');
            
            // Give a small delay to capture any final speech
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const transcription = await stopRecording();
            console.log('Raw transcription result:', transcription);
            
            setShowRecording(false);
            setError(null);
            
            if (transcription && transcription.trim()) {
                console.log('Valid transcription received:', transcription);
                setLastTranscription(transcription);
                onTranscriptionComplete(transcription);
            } else {
                // If we have a partial transcription from the logs, try to recover it
                if (lastTranscription && lastTranscription.trim()) {
                    console.log('Using last known transcription:', lastTranscription);
                    onTranscriptionComplete(lastTranscription);
                } else {
                    const errorMsg = 'Transcrição incompleta detectada. Verifique os logs do console - o texto pode ter sido capturado mas não finalizado corretamente.';
                    console.warn(errorMsg);
                    setError('Transcrição incompleta');
                    
                    // Show option to try sending anyway
                    if (window.confirm(errorMsg + '\n\nDeseja tentar enviar uma mensagem de teste?')) {
                        onTranscriptionComplete('Teste de transcrição de áudio');
                    }
                }
            }
        } catch (error) {
            console.error('Transcription process failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro na transcrição';
            setError(errorMessage);
            
            // Offer fallback option
            if (window.confirm(`Erro na transcrição: ${errorMessage}\n\nDeseja enviar uma mensagem de teste mesmo assim?`)) {
                onTranscriptionComplete('Teste de áudio - transcrição com erro');
            }
            setShowRecording(false);
        }
    };

    const handleCancelRecording = () => {
        console.log('Recording cancelled');
        cancelRecording();
        setShowRecording(false);
        setError(null);
    };

    const formatDuration = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Show service unavailable state
    if (!isAvailable) {
        return (
            <div className={cn("flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800", className)}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Microfone não disponível</span>
            </div>
        );
    }

    // Show transcribing state
    if (isTranscribing) {
        return (
            <div className={cn("flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800", className)}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Transcrevendo...</span>
            </div>
        );
    }

    // Show recording state
    if (showRecording && isRecording) {
        return (
            <div className={cn("flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3", className)}>
                {/* Recording header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-mono text-red-600 dark:text-red-400 min-w-[40px]">
                            {formatDuration(recordingDuration)}
                        </span>
                    </div>
                    
                    <div className="flex gap-1">
                        {/* Stop button */}
                        <Button
                            onClick={handleStopRecording}
                            size="sm"
                            variant="secondary"
                            className="h-7 px-3 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs"
                        >
                            <Square className="w-3 h-3 mr-1" />
                            Parar
                        </Button>

                        {/* Cancel button */}
                        <Button
                            onClick={handleCancelRecording}
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
                        >
                            ✕
                        </Button>
                    </div>
                </div>

                {/* Visual instruction and real-time transcript */}
                <div className="space-y-1">
                    <div className="text-xs text-red-600 dark:text-red-400 text-center">
                        🎤 Fale agora... Sua voz será transcrita automaticamente
                    </div>
                    {currentTranscript && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-black/20 rounded px-2 py-1 max-w-full overflow-hidden">
                            <span className="font-mono">&quot;{currentTranscript}&quot;</span>
                        </div>
                    )}
                </div>

                {/* Waveform animation */}
                <div className="flex items-center justify-center gap-1">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-red-400 rounded-full animate-pulse"
                            style={{
                                height: `${6 + Math.random() * 12}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '0.6s'
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Show error state with recovery option
    if (error && lastTranscription && lastTranscription.trim()) {
        return (
            <div className={cn("flex flex-col gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800", className)}>
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Problema na transcrição</span>
                </div>
                <div className="text-xs bg-white/50 dark:bg-black/20 rounded px-2 py-1">
                    Texto capturado: &quot;{lastTranscription}&quot;
                </div>
                <div className="flex gap-1">
                    <Button
                        onClick={() => {
                            setError(null);
                            onTranscriptionComplete(lastTranscription);
                        }}
                        size="sm"
                        className="h-6 px-2 bg-orange-500 hover:bg-orange-600 text-white text-xs"
                    >
                        Usar Este Texto
                    </Button>
                    <Button
                        onClick={() => setError(null)}
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                    >
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    // Show simple error state for other errors
    if (error) {
        return (
            <div className={cn("flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800", className)}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Erro no microfone</span>
                <Button
                    onClick={() => setError(null)}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs ml-auto"
                >
                    Tentar Novamente
                </Button>
            </div>
        );
    }

    // Default state - record button
    return (
        <Button
            onClick={handleStartRecording}
            disabled={disabled || !isAvailable}
            size="icon"
            variant="outline"
            className={cn(
                "h-11 w-11 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group",
                className
            )}
            title={`Gravar áudio (${serviceInfo})`}
        >
            <Mic className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
        </Button>
    );
}