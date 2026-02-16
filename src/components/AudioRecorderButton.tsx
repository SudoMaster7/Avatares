'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, Send, X } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { cn } from '@/lib/utils';

interface AudioRecorderButtonProps {
    onTranscriptionComplete: (text: string) => void;
    disabled?: boolean;
    className?: string;
    selectedDeviceId?: string;
}

export function AudioRecorderButton({ 
    onTranscriptionComplete, 
    disabled,
    className,
    selectedDeviceId
}: AudioRecorderButtonProps) {
    const [showRecording, setShowRecording] = useState(false);
    const {
        isRecording,
        isTranscribing,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
    } = useAudioRecorder();

    const handleStartRecording = async () => {
        try {
            // Check if Speech Recognition is available
            if (typeof window === 'undefined') {
                throw new Error('Web Speech API não disponível no servidor.');
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                throw new Error('Web Speech API não é suportada neste navegador. Use Chrome, Firefox ou Safari.');
            }

            console.log('Starting recording with device:', selectedDeviceId);
            await startRecording(selectedDeviceId);
            setShowRecording(true);
        } catch (error) {
            console.error('Recording failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            alert(`Erro ao iniciar gravação: ${errorMessage}`);
        }
    };

    const handleStopRecording = async () => {
        try {
            console.log('Stopping recording...');
            const transcription = await stopRecording();
            console.log('Received transcription:', transcription);
            setShowRecording(false);
            
            if (transcription && transcription.trim()) {
                console.log('Sending transcription to parent:', transcription);
                onTranscriptionComplete(transcription);
            } else {
                console.warn('No transcription received');
                alert('Não foi possível transcrever o áudio. Certifique-se de que falou claramente e tente novamente.');
            }
        } catch (error) {
            console.error('Transcription failed:', error);
            alert(`Erro na transcrição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            setShowRecording(false);
        }
    };

    const handleCancelRecording = () => {
        cancelRecording();
        setShowRecording(false);
    };

    const formatDuration = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (isTranscribing) {
        return (
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-xl">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Transcrevendo...</span>
            </div>
        );
    }

    if (showRecording && isRecording) {
        return (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-2">
                {/* Recording indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-red-600 dark:text-red-400 min-w-[40px]">
                        {formatDuration(recordingDuration)}
                    </span>
                </div>

                {/* Waveform animation */}
                <div className="flex items-center gap-1 mx-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-red-400 rounded-full animate-pulse"
                            style={{
                                height: `${8 + Math.random() * 16}px`,
                                animationDelay: `${i * 0.1}s`,
                                animationDuration: '0.8s'
                            }}
                        />
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelRecording}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleStopRecording}
                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleStartRecording}
            disabled={disabled}
            className={cn(
                "h-11 w-11 sm:h-13 sm:w-13 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            title="Gravar áudio"
        >
            <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </Button>
    );
}