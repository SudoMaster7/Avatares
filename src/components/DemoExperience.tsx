/**
 * DemoExperience – Pre-login landing + demo chat
 * Shows a single avatar (Prof. Carlos) with 3 message limit.
 * After limit, shows persuasive signup/upgrade modal.
 */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DEMO_AVATAR, DEMO_STARTERS, DEMO_LIMIT_MESSAGES } from '@/lib/demo-avatar';
import { TOKEN_LIMITS } from '@/lib/tokens';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface DemoExperienceProps {
    onSignUp: () => void;
    onLogin: () => void;
    onUpgrade: () => void;
}

export function DemoExperience({ onSignUp, onLogin, onUpgrade }: DemoExperienceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [messagesRemaining, setMessagesRemaining] = useState<number>(TOKEN_LIMITS.guest.maxMessagesTotal);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const userMessageCount = messages.filter((m) => m.role === 'user').length;

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Check if limit reached
    useEffect(() => {
        const remaining = TOKEN_LIMITS.guest.maxMessagesTotal - userMessageCount;
        setMessagesRemaining(remaining);
        if (remaining <= 0 && messages.length > 0) {
            setTimeout(() => setShowLimitModal(true), 1500);
        }
    }, [userMessageCount, messages.length]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading || userMessageCount >= TOKEN_LIMITS.guest.maxMessagesTotal) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: DEMO_AVATAR.personality },
                        ...messages.map((m) => ({ role: m.role, content: m.content })),
                        { role: 'user', content: text },
                    ],
                    isDemo: true,
                    messageNumber: userMessageCount + 1,
                }),
            });

            const data = await res.json();
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content || 'Desculpe, tive um problema. Tente novamente!',
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Ops! Algo deu errado. Tente novamente.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-xl">
                        🏫
                    </div>
                    <div>
                        <h1 className="font-bold text-white">Vila do Saber</h1>
                        <p className="text-xs text-white/50">Experimente grátis</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onLogin}
                        className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                        Entrar
                    </button>
                    <button
                        onClick={onSignUp}
                        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-300"
                    >
                        Criar conta
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className="flex flex-1 flex-col lg:flex-row">
                {/* Left: Avatar info */}
                <aside className="flex flex-col items-center border-b border-white/10 p-6 lg:w-80 lg:border-b-0 lg:border-r">
                    <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-6xl">
                        👨‍🏫
                    </div>
                    <h2 className="mb-1 text-xl font-bold text-white">{DEMO_AVATAR.name}</h2>
                    <p className="mb-4 text-sm text-white/60">{DEMO_AVATAR.subject}</p>
                    <p className="mb-6 text-center text-sm leading-relaxed text-white/70">
                        {DEMO_AVATAR.description}
                    </p>

                    {/* Progress indicator */}
                    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-2 flex justify-between text-xs">
                            <span className="text-white/50">Mensagens restantes</span>
                            <span className="font-bold text-amber-400">{messagesRemaining}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                                style={{ width: `${(messagesRemaining / TOKEN_LIMITS.guest.maxMessagesTotal) * 100}%` }}
                            />
                        </div>
                        <p className="mt-2 text-center text-xs text-white/40">
                            Crie uma conta para continuar conversando
                        </p>
                    </div>
                </aside>

                {/* Right: Chat */}
                <main className="flex flex-1 flex-col">
                    {/* Messages */}
                    <div className="flex-1 space-y-4 overflow-y-auto p-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-6 text-5xl">👋</div>
                                <h3 className="mb-2 text-xl font-bold text-white">
                                    Olá! Eu sou o {DEMO_AVATAR.name}
                                </h3>
                                <p className="mb-6 max-w-md text-sm text-white/60">
                                    Experimente conversar comigo! Escolha uma pergunta ou escreva a sua.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {DEMO_STARTERS.map((starter) => (
                                        <button
                                            key={starter}
                                            onClick={() => sendMessage(starter)}
                                            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400"
                                        >
                                            {starter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                        msg.role === 'user'
                                            ? 'bg-amber-400 text-black'
                                            : 'bg-white/10 text-white'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl bg-white/10 px-4 py-3 text-white/50">
                                    <span className="animate-pulse">Digitando...</span>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-white/10 p-4">
                        {messagesRemaining <= 0 ? (
                            <div className="flex items-center justify-center gap-4 rounded-xl bg-amber-400/10 px-4 py-3">
                                <span className="text-sm text-amber-400">
                                    ✨ Demonstração completa! Crie sua conta para continuar.
                                </span>
                                <button
                                    onClick={onSignUp}
                                    className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black"
                                >
                                    Criar conta
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendMessage(input);
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-amber-400/50"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300 disabled:opacity-50"
                                >
                                    Enviar
                                </button>
                            </form>
                        )}
                    </div>
                </main>
            </div>

            {/* Limit reached modal */}
            {showLimitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 text-center">
                            <div className="mb-3 text-5xl">🎉</div>
                            <h2 className="text-2xl font-bold text-white">{DEMO_LIMIT_MESSAGES.title}</h2>
                            <p className="mt-1 text-white/60">{DEMO_LIMIT_MESSAGES.subtitle}</p>
                        </div>

                        {/* Benefits */}
                        <div className="p-6">
                            <p className="mb-4 text-center text-sm font-medium text-white/70">
                                Ao criar sua conta, você também pode conversar com:
                            </p>
                            <ul className="mb-6 space-y-2">
                                {DEMO_LIMIT_MESSAGES.benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-2 text-sm text-white/80">
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            {/* CTAs */}
                            <div className="space-y-3">
                                {/* Pro CTA (highlighted) */}
                                <button
                                    onClick={onUpgrade}
                                    className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 p-4 text-left transition hover:opacity-90"
                                >
                                    <span className="absolute right-3 top-3 rounded-full bg-black/20 px-2 py-0.5 text-xs font-bold">
                                        {DEMO_LIMIT_MESSAGES.ctas.pro.highlight}
                                    </span>
                                    <span className="block text-lg font-bold text-black">
                                        {DEMO_LIMIT_MESSAGES.ctas.pro.label}
                                    </span>
                                    <span className="text-sm text-black/70">
                                        {DEMO_LIMIT_MESSAGES.ctas.pro.description}
                                    </span>
                                </button>

                                {/* Free CTA */}
                                <button
                                    onClick={onSignUp}
                                    className="w-full rounded-xl border border-white/20 p-4 text-left transition hover:bg-white/5"
                                >
                                    <span className="block font-bold text-white">
                                        {DEMO_LIMIT_MESSAGES.ctas.free.label}
                                    </span>
                                    <span className="text-sm text-white/50">
                                        {DEMO_LIMIT_MESSAGES.ctas.free.description}
                                    </span>
                                </button>
                            </div>

                            {/* Login link */}
                            <p className="mt-4 text-center text-sm text-white/40">
                                Já tem conta?{' '}
                                <button onClick={onLogin} className="text-amber-400 underline">
                                    Entrar
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
