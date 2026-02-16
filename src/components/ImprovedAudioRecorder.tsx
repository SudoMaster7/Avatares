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
}

export function ImprovedAudioRecorder({ 
    onTranscriptionComplete, 
    disabled,
    className
}: ImprovedAudioRecorderProps) {
    const [showRecording, setShowRecording] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const {
        isRecording,
        recordingDuration,
        currentTranscript,
        startRecording,
        stopRecording,
        isSupported,
    } = useSimpleRecorder();

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            setError(null);
            setShowRecording(false);
        };
    }, []);

    const handleStartRecording = async () => {
        try {
            setError(null);
            console.log('🎤 Starting recording...');
            
            // Check browser support first
            if (!isSupported) {
                throw new Error('Seu navegador não suporta gravação de áudio');
            }
            
            startRecording();
            setShowRecording(true);
            console.log('✅ Recording interface shown');
        } catch (error) {
            console.error('❌ Failed to start recording:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro ao iniciar gravação';
            setError(errorMessage);
            setShowRecording(false); // Make sure we don't show recording UI on error
        }
    };

    const handleStopRecording = async () => {
        try {
            console.log('🛑 User manually stopping recording...');
            const transcription = await stopRecording();
            console.log('📝 Transcription result:', transcription);
            
            // Always close recording UI when user clicks stop
            setShowRecording(false);
            setError(null);
            
            if (transcription && transcription.trim()) {
                console.log('✅ Sending transcription:', transcription);
                onTranscriptionComplete(transcription.trim());
            } else {
                console.log('⚠️ No transcription received');
                setError('Nenhum texto detectado - tente falar mais alto');
            }
        } catch (error) {
            console.error('❌ Transcription failed:', error);
            setError('Erro na transcrição');
            setShowRecording(false);
        }
    };

    const handleCancelRecording = async () => {
        console.log('Recording cancelled');
        await stopRecording(); // Just stop, don't process the result
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
    if (!isSupported) {
        return (
            <div className={cn("flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800", className)}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Microfone não disponível</span>
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
                        🎤 Gravando... Fale normalmente. O botão só para quando você clicar PARAR
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
            disabled={disabled || !isSupported}
            size="icon"
            variant="outline"
            className={cn(
                "h-11 w-11 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group",
                className
            )}
            title="Gravar áudio"
        >
            <Mic className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
        </Button>
    );
}