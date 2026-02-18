'use client';

import { useState, useEffect } from 'react';
import { AVATARS, AvatarConfig, getAvatarBySubjectId } from '@/lib/avatars';
import { SUBJECTS } from '@/lib/subjects';
import { Scenario } from '@/lib/scenarios';
import { StudentDashboard } from '@/components/dashboard';
import { AvatarCard } from '@/components/AvatarCard';
import { ConversationInterface } from '@/components/ConversationInterface';
import { ScenarioSelector } from '@/components/ScenarioSelector';
import { GamificationHUD } from '@/components/GamificationHUD';
import { ChallengeArena } from '@/components/ChallengeArena';
import { UserMenu } from '@/components/UserMenu';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { AuthDialog } from '@/components/AuthDialog';
import { GraduationCap, Sparkles, Brain, Zap, Volume2, Trophy, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type ViewMode = 'dashboard' | 'home' | 'conversation' | 'scenarios' | 'arena';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarConfig | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string | undefined>(undefined);
  const [isPro, setIsPro] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [lockedAvatarId, setLockedAvatarId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        // admins always get Pro access
        setIsPro(meta?.plan === 'pro' || meta?.role === 'admin');
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const meta = session?.user?.user_metadata;
      setIsPro(meta?.plan === 'pro' || meta?.role === 'admin');
    });
    return () => subscription.unsubscribe();
  }, []);

  // Handle URL params for Custom Mentor
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const personagem = params.get('personagem');
    const custom = params.get('custom');

    if (personagem && custom === 'true') {
      const storedPrompt = sessionStorage.getItem("current_mentor_prompt");
      if (storedPrompt) {
        setCustomSystemPrompt(storedPrompt);

        // Dynamic import to avoid SSR issues if needed, or just use the helper
        import('@/lib/custom-avatar').then(({ createCustomAvatarConfig }) => {
          const customAvatar = createCustomAvatarConfig(personagem, "Mentor Histórico Personalizado");
          setSelectedAvatar(customAvatar);
          setViewMode('conversation');
        });
      }
    }
  }, []);

  // Dashboard view
  if (viewMode === 'dashboard') {
    return (
      <StudentDashboard
        onNavigateTo={(view, subjectId) => {
          if (view === 'avatars') {
            setViewMode('home');
          } else if (view === 'mini-games') {
            setViewMode('scenarios');
          } else if (view === 'conversation' && subjectId) {
            const avatar = getAvatarBySubjectId(subjectId);
            if (avatar) {
              setSelectedAvatar(avatar);
              setViewMode('conversation');
            }
          }
        }}
      />
    );
  }

  // Conversation view
  if (viewMode === 'conversation' && selectedAvatar) {
    return (
      <ConversationInterface
        avatar={selectedAvatar}
        scenario={selectedScenario}
        customSystemPrompt={customSystemPrompt}
        onBack={() => {
          setViewMode('home');
          setSelectedAvatar(null);
          setSelectedScenario(null);
          setCustomSystemPrompt(undefined);
          // Clean URL
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  // Scenario selection view
  if (viewMode === 'scenarios' && selectedAvatar) {
    return (
      <ScenarioSelector
        avatar={selectedAvatar}
        onSelectScenario={(scenario) => {
          setSelectedScenario(scenario);
          setViewMode('conversation');
        }}
        onBack={() => {
          setViewMode('home');
          setSelectedAvatar(null);
        }}
      />
    );
  }

  // Challenge Arena view
  if (viewMode === 'arena') {
    return <ChallengeArena onBack={() => setViewMode('home')} />;
  }

  // Home view - Landing Page with Dashboard Style
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative z-20 sticky top-0 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <motion.div
              className="flex items-center gap-2 sm:gap-3 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Avatares Educacionais
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Aprenda interagindo com mentores IA especializados 🤖
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-1 sm:gap-3 items-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DarkModeToggle />
              <Button
                className="hidden sm:flex bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg text-sm"
                onClick={() => setViewMode('dashboard')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                className="sm:hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg px-3 py-2 h-auto text-xs"
                onClick={() => setViewMode('dashboard')}
              >
                <Sparkles className="w-4 h-4" />
              </Button>
              <UserMenu />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <Zap className="w-4 h-4" />
            100% Gratuito
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Bem-vindo ao AvatarES!
            </span>
            {' '}
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">🎓</span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-400 max-w-3xl mx-auto mb-8 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Aprenda com mentores especializados em inteligência artificial. Escolha entre {SUBJECTS.length} matérias diferentes, pratique em cenários reais e desenvolva suas habilidades de forma divertida e interativa!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-2xl text-lg px-8 py-6 rounded-full"
              onClick={() => setViewMode('dashboard')}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Acessar Dashboard
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-2 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            {
              icon: Brain,
              title: '13 Matérias Completas',
              description: 'Matemática, Português, Ciências, História, Geografia, Inglês e mais!',
              color: 'from-blue-400 to-blue-600',
              bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30'
            },
            {
              icon: Volume2,
              title: 'Vozes Premium',
              description: 'Vozes naturais em português e inglês para melhor aprendizado',
              color: 'from-purple-400 to-purple-600',
              bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30'
            },
            {
              icon: Sparkles,
              title: 'IA Inteligente',
              description: 'Respostas rápidas e contextualizadas para personalizar seu aprendizado',
              color: 'from-pink-400 to-pink-600',
              bgColor: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/30'
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${feature.bgColor} rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/40 dark:border-slate-700/40 backdrop-blur-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Avatars Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
              Escolha seu Mentor 👨‍🏫
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-400 px-2 sm:px-0 mb-3">
              {AVATARS.length} avatares especializados esperando por você
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold border border-green-200 dark:border-green-700">
                <Star className="w-3.5 h-3.5 fill-current" />
                Grátis — 3 personagens incluídos
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-semibold border border-yellow-200 dark:border-yellow-700">
                <Lock className="w-3.5 h-3.5" />
                Pro — {AVATARS.filter(a => !a.isFree).length} personagens exclusivos
              </span>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/20 dark:border-slate-700/20">
            {/* Free avatars */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                Plano Grátis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {AVATARS.filter(a => a.isFree).map((avatar, idx) => (
                  <motion.div
                    key={avatar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.05 }}
                  >
                    <AvatarCard
                      avatar={avatar}
                      isLocked={false}
                      onSelect={(avatar) => {
                        setSelectedAvatar(avatar);
                        setViewMode('conversation');
                      }}
                      onSelectScenario={(avatar) => {
                        setSelectedAvatar(avatar);
                        setViewMode('scenarios');
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pro avatars */}
            <div>
              <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Exclusivo Plano Pro
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {AVATARS.filter(a => !a.isFree).map((avatar, idx) => (
                  <motion.div
                    key={avatar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + idx * 0.05 }}
                  >
                    <AvatarCard
                      avatar={avatar}
                      isLocked={!isPro}
                      onSelect={(avatar) => {
                        if (!isPro) { window.location.href = '/planos'; return; }
                        setSelectedAvatar(avatar);
                        setViewMode('conversation');
                      }}
                      onSelectScenario={(avatar) => {
                        if (!isPro) { window.location.href = '/planos'; return; }
                        setSelectedAvatar(avatar);
                        setViewMode('scenarios');
                      }}
                      onUpgrade={() => { window.location.href = '/planos'; }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Auth dialog for locked avatars */}
          {showAuthDialog && (
            <AuthDialog
              open={showAuthDialog}
              onOpenChange={(open) => { setShowAuthDialog(open); if (!open) setLockedAvatarId(null); }}
              onSuccess={() => { setShowAuthDialog(false); setLockedAvatarId(null); }}
            />
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-12 sm:mt-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center text-white shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 px-2">
            Pronto para começar sua jornada educacional? 🚀
          </h3>
          <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 px-2">
            Acesse o dashboard para explorar todas as matérias, mini-games e ganhar pontos!
          </p>
          <Button
            size="lg"
            className="bg-white text-indigo-600 hover:bg-gray-100 text-lg font-bold px-8 py-6"
            onClick={() => setViewMode('dashboard')}
          >
            Acessar Dashboard Agora
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 sm:mt-16 text-center px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-blue-100/60 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700/50 rounded-lg p-4 inline-block backdrop-blur-sm">
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 font-medium">
              ⚠️ <strong>Versão MVP</strong> - Esta é uma versão de demonstração inicial. Mais funcionalidades em breve!
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
