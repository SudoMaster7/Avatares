'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { isTranscriptionAvailable, getTranscriptionInfo } from '@/services/transcription';

interface MicrophoneTestProps {
    onTestComplete?: (result: TestResult) => void;
}

interface TestResult {
    microphoneAccess: boolean;
    speechRecognition: boolean;
    deviceCount: number;
    error?: string;
}

export function MicrophoneTest({ onTestComplete }: MicrophoneTestProps) {
    const [isTestingMic, setIsTestingMic] = useState(false);
    const [isTestingSpeech, setIsTestingSpeech] = useState(false);
    const [testResults, setTestResults] = useState<TestResult | null>(null);

    const runFullTest = async () => {
        setTestResults(null);
        
        const results: TestResult = {
            microphoneAccess: false,
            speechRecognition: false,
            deviceCount: 0,
        };

        try {
            // Test 1: Check Web Speech API availability
            results.speechRecognition = isTranscriptionAvailable();
            
            // Test 2: Test microphone access
            setIsTestingMic(true);
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                results.microphoneAccess = true;
                
                // Get available devices
                const devices = await navigator.mediaDevices.enumerateDevices();
                results.deviceCount = devices.filter(d => d.kind === 'audioinput').length;
                
                // Close the stream
                stream.getTracks().forEach(track => track.stop());
            } catch (error) {
                results.microphoneAccess = false;
                results.error = error instanceof Error ? error.message : 'Erro ao acessar microfone';
            }
            setIsTestingMic(false);

            // Test 3: Test speech recognition
            if (results.speechRecognition && results.microphoneAccess) {
                setIsTestingSpeech(true);
                try {
                    await testSpeechRecognition();
                } catch (error) {
                    results.speechRecognition = false;
                    results.error = error instanceof Error ? error.message : 'Erro no reconhecimento de fala';
                }
                setIsTestingSpeech(false);
            }

        } catch (error) {
            results.error = error instanceof Error ? error.message : 'Erro no teste';
        }

        setTestResults(results);
        onTestComplete?.(results);
    };

    const testSpeechRecognition = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!isTranscriptionAvailable()) {
                reject(new Error('Web Speech API não disponível'));
                return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'pt-BR';
            recognition.continuous = false;
            recognition.interimResults = false;

            let timeoutId: NodeJS.Timeout;

            recognition.onstart = () => {
                // Auto-stop after 2 seconds for testing
                timeoutId = setTimeout(() => {
                    recognition.stop();
                }, 2000);
            };

            recognition.onresult = () => {
                clearTimeout(timeoutId);
                resolve();
            };

            recognition.onerror = (event) => {
                clearTimeout(timeoutId);
                reject(new Error(`Speech Recognition Error: ${event.error}`));
            };

            recognition.onend = () => {
                clearTimeout(timeoutId);
                resolve(); // Consider test successful even without speech
            };

            recognition.start();
        });
    };

    return (
        <Card className="p-4 max-w-md mx-auto">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                    <Mic className="w-5 h-5" />
                    Teste de Microfone
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span>Web Speech API:</span>
                        {isTranscriptionAvailable() ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                        {getTranscriptionInfo()}
                    </div>
                </div>

                <Button 
                    onClick={runFullTest}
                    disabled={isTestingMic || isTestingSpeech}
                    className="w-full"
                >
                    {isTestingMic && 'Testando Microfone...'}
                    {isTestingSpeech && 'Testando Reconhecimento...'}
                    {!isTestingMic && !isTestingSpeech && 'Executar Teste Completo'}
                </Button>

                {testResults && (
                    <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium">Resultados do Teste:</div>
                        
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                                <span>Acesso ao Microfone:</span>
                                {testResults.microphoneAccess ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                    <XCircle className="w-3 h-3 text-red-500" />
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span>Reconhecimento de Fala:</span>
                                {testResults.speechRecognition ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                    <XCircle className="w-3 h-3 text-red-500" />
                                )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span>Microfones Detectados:</span>
                                <span>{testResults.deviceCount}</span>
                            </div>
                            
                            {testResults.error && (
                                <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span>{testResults.error}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}