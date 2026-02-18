'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleOAuthCallback } from '@/services/auth-service';
import { GraduationCap, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Finalizando login...');

    useEffect(() => {
        const processCallback = async () => {
            try {
                const session = await handleOAuthCallback();
                
                if (session) {
                    setStatus('success');
                    setMessage('Login realizado com sucesso!');
                    
                    // Redirect to home after brief delay
                    setTimeout(() => {
                        router.push('/');
                    }, 1500);
                } else {
                    setStatus('error');
                    setMessage('Sessão não encontrada. Tente novamente.');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                setStatus('error');
                setMessage('Erro ao processar login. Tente novamente.');
            }
        };

        processCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-9 h-9 text-white" />
                </div>

                {/* Status Icon */}
                <div className="mb-4">
                    {status === 'loading' && (
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                    )}
                    {status === 'success' && (
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    )}
                    {status === 'error' && (
                        <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                    )}
                </div>

                {/* Message */}
                <h2 className={`text-xl font-bold mb-2 ${
                    status === 'success' ? 'text-green-600' :
                    status === 'error' ? 'text-red-600' :
                    'text-gray-800 dark:text-white'
                }`}>
                    {status === 'loading' && 'Processando...'}
                    {status === 'success' && 'Sucesso!'}
                    {status === 'error' && 'Erro'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {message}
                </p>

                {/* Error action */}
                {status === 'error' && (
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar ao início
                    </button>
                )}
            </div>
        </div>
    );
}
