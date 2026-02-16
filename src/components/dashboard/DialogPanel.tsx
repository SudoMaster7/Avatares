'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X, Volume2, Loader2, Sparkles } from 'lucide-react';
import { generateResponse, createAvatarSystemPrompt } from '@/services/groq';
import { speak, initializeTTS } from '@/services/tts';
import type { AvatarConfig } from '@/lib/avatars';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DialogPanelProps {
  avatar: AvatarConfig;
  subjectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DialogPanel({ avatar, subjectName, isOpen, onClose }: DialogPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize TTS
  useEffect(() => {
    if (isOpen) {
      initializeTTS();

      // Welcome message
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: '0',
          role: 'assistant',
          content: `Olá! Eu sou ${avatar.name}, sua mentora de ${subjectName}. Como posso ajudá-lo hoje? 😊`,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen, avatar, subjectName, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const systemPrompt = createAvatarSystemPrompt(
        avatar.name,
        avatar.personality,
        avatar.subject,
        avatar.language
      );

      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
          .filter((m) => m.role !== 'assistant')
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
        { role: 'user', content: input },
      ];

      const response = await generateResponse({
        messages: chatMessages as any,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                  {avatar.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold">{avatar.name}</p>
                  <p className="text-xs text-white/80">{subjectName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-200 dark:bg-slate-700 px-4 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t dark:border-slate-700 p-4 space-y-2">
              {isSpeaking && (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg text-xs font-medium">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  Avatar falando...
                </div>
              )}

              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  disabled={isProcessing || isSpeaking}
                  className="resize-none text-sm"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing || isSpeaking}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Pensando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
