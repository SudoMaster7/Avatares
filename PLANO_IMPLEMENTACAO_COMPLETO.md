# 🎓 Plano de Implementação Completo - Avatares Educacionais

**Data:** Fevereiro 2026  
**Objetivo:** Transformar o projeto em uma plataforma educacional gamificada com todas as matérias do colégio

---

## 📊 ANÁLISE ATUAL DO PROJETO

### ✅ Pontos Fortes
- **Stack moderno**: Next.js 15 + React 19 + TypeScript
- **Arquitetura escalável**: Componentes bem organizados, separação de conceitos
- **Integração IA**: Groq API para LLM (gratuito)
- **TTS/STT**: Google Cloud TTS + Whisper para vozes
- **Banco de dados**: PostgreSQL/Supabase estruturado
- **Gamificação básica**: Sistema de XP, níveis, achievements
- **UI bonita**: Tailwind CSS + Radix UI com bom design

### ⚠️ Áreas para Melhorar
- **Avatares limitados**: Apenas 3 avatares, faltam matérias
- **Cenários poucos**: Apenas exemplos iniciais
- **Animações básicas**: Framer Motion presente mas pouco explorado
- **Gamificação superficial**: Sem desafios dinâmicos reais
- **Interface estática**: Pouca interatividade e feedback visual
- **Falta de progressão**: Sem sistema de badges, streaks visuais
- **Sem mini-games**: Apenas conversa, sem diversão

---

## 🎯 VISÃO FINAL DO PROJETO

### Plataforma Educacional Gamificada "EduVerse"
Uma plataforma onde alunos interagem com avatares IA especializados em cada matéria, completando desafios, ganhando pontos e desbloqueando conteúdo através de:
- ✨ **13 Matérias** com avatares únicos e personalizados
- 🎮 **Mini-games educacionais** integrados aos cenários
- 🏆 **Sistema avançado de recompensas** (badges, skins, temas)
- 🎨 **Animações fluidas** em todas as interações
- 📊 **Dashboard de progresso** visual e motivador
- 🌍 **Comunidade**: Rankings e desafios globais
- 🎪 **Arena de Desafios**: Batalhas educacionais em tempo real

---

## 📚 MATÉRIAS E AVATARES PROPOSTOS

### Ensino Fundamental (1º ao 9º)

#### 1. **Matemática** - Prof. Carlos (Existente)
- Emoji: 🔢
- Cor: Azul (#3B82F6)
- Especialidade: Números, geometria, álgebra
- Personalidade: Paciente, usa exemplos práticos
- Cenários: Problemas do dia a dia, cálculos, geometria

#### 2. **Português** - Profa. Mariana (NOVO)
- Emoji: 📖
- Cor: Verde (#10B981)
- Especialidade: Literatura, gramática, redação
- Personalidade: Culta, apaixonada por leitura, incentivadora
- Cenários: Análise de textos, redação criativa, poesia

#### 3. **Ciências** - Prof. Bruno (NOVO)
- Emoji: 🔬
- Cor: Roxo (#8B5CF6)
- Especialidade: Biologia, física, química básica
- Personalidade: Entusiasmado, faz perguntas provocativas
- Cenários: Experimentos virtuais, conceitos científicos, ecologia

#### 4. **História** - Dom Pedro II (Existente)
- Emoji: 📜
- Cor: Marrom (#92400E)
- Especialidade: História do Brasil, contexto histórico
- Personalidade: Sábio, elegante, reflexivo
- Cenários: Períodos históricos, causa e efeito

#### 5. **Geografia** - Profa. Sofia (NOVO)
- Emoji: 🌍
- Cor: Teal (#06B6D4)
- Especialidade: Mapas, climas, culturas, economia
- Personalidade: Aventureira, curiosa, didática
- Cenários: Viagens virtuais, análise de mapas

#### 6. **Inglês** - Sarah (Existente)
- Emoji: 🇬🇧
- Cor: Laranja (#F97316)
- Especialidade: Conversação, gramática, vocabulário
- Personalidade: Amigável, paciente, moderna
- Cenários: Situações reais, conversas práticas

#### 7. **Educação Física** - Prof. Lucas (NOVO)
- Emoji: ⚽
- Cor: Vermelho (#EF4444)
- Especialidade: Esportes, saúde, movimento
- Personalidade: Entusiasmado, motivador, divertido
- Cenários: Técnicas de esportes, primeiros socorros

#### 8. **Arte** - Mestra Carolina (NOVO)
- Emoji: 🎨
- Cor: Rosa (#EC4899)
- Especialidade: Artes plásticas, música, criatividade
- Personalidade: Criativa, inspiradora, livre-pensadora
- Cenários: Análise de obras, técnicas artísticas, criação

#### 9. **Música** - Maestro Antônio (NOVO)
- Emoji: 🎵
- Cor: Indigo (#6366F1)
- Especialidade: Notas, ritmo, história da música
- Personalidade: Apaixonado, alegre, paciente
- Cenários: Noções musicais, história da música

#### 10. **Filosofia** - Sócrates (NOVO - Estudante+)
- Emoji: 🤔
- Cor: Cinza (#6B7280)
- Especialidade: Ética, lógica, pensamento crítico
- Personalidade: Questionador, antigo, sábio
- Cenários: Dilemas morais, pensamento crítico

#### 11. **Religião/Ética** - Monge Tenzin (NOVO)
- Emoji: ☮️
- Cor: Dourado (#F59E0B)
- Especialidade: Valores, ética, compaixão
- Personalidade: Sereno, sábio, inclusivo
- Cenários: Dilemas éticos, valores humanos

#### 12. **Informática** - Dev Ana (NOVO)
- Emoji: 💻
- Cor: Ciano (#06B6D4)
- Especialidade: Programação básica, lógica, segurança
- Personalidade: Tech-savvy, moderna, paciente
- Cenários: Problemas de lógica, conceitos de programação

#### 13. **Espanhol** - Señorita Isabella (NOVO)
- Emoji: 🇪🇸
- Cor: Ouro (#F59E0B)
- Especialidade: Conversação em espanhol, cultura
- Personalidade: Entusiasmada, colorida, amigável
- Cenários: Conversas em espanhol, cultura latino-americana

---

## 🎮 MINI-GAMES EDUCACIONAIS

### Por Matéria

#### Matemática
- **Quiz Relâmpago**: 5 problemas contra cronômetro
- **Montador de Expressões**: Arraste números para criar expressões
- **Jogo da Memória Numérica**: Encontre pares de operações equivalentes
- **Construtor de Gráficos**: Monte gráficos interativos

#### Português
- **Corrector de Textos**: Corrija erros em frases
- **Jogo da Rima**: Complete frases com palavras que rimam
- **Sequência de Histórias**: Organize parágrafos em ordem
- **Caça-Palavras Educativo**: Encontre vocabulário temático

#### Ciências
- **Montador de Moléculas**: Arraste átomos para criar moléculas
- **Ciclo da Água**: Clique na sequência correta
- **Classificador de Seres Vivos**: Arraste para categorias
- **Experimento Virtual**: Simule experimentos

#### História
- **Timeline Interativa**: Organize eventos na linha do tempo
- **Quiz Histórico**: Responda perguntas sobre períodos
- **Causa e Efeito**: Conecte eventos e consequências
- **Jogo das Civilizações**: Identifique características

#### Geografia
- **Montador de Mapas**: Arraste regiões para posição correta
- **Jogo dos Climas**: Identifique climas de cidades
- **Capital Rush**: Responda capitais contra cronômetro
- **Visualizador 3D**: Explorar globo terrestre

#### Inglês
- **Conversação Acelerada**: Responda rápido em inglês
- **Teste de Vocabulário**: Pareie palavras com imagens
- **Jogo da Pronúncia**: Ouça e escolha a pronuncia correta
- **Construtor de Frases**: Organize palavras em ordem

#### Educação Física
- **Desafio de Sequências**: Aprenda movimentos em sequência
- **Quiz de Regras**: Teste conhecimento de regras
- **Jogo de Reação**: Reaja rápido a comandos
- **Simulador de Esportes**: Pratique técnicas

#### Arte
- **Quiz de Obras**: Identifique obras e artistas
- **Misturador de Cores**: Aprenda teoria das cores
- **Criador de Padrões**: Crie padrões geométricos
- **Galeria Virtual**: Explore arte interativa

#### Música
- **Identificador de Notas**: Ouça e identifique notas
- **Jogo de Ritmo**: Siga sequências de ritmo
- **Quiz Musical**: Identifique compositores e músicas
- **Criador de Melodias**: Componha frases musicais

#### Filosofia
- **Dilema Moral**: Escolha e debata decisões
- **Jogo da Lógica**: Resolva enigmas lógicos
- **Pensador Crítico**: Analise argumentos
- **Jogo de Perspectivas**: Veja questões de múltiplos ângulos

#### Religião/Ética
- **Valores Quiz**: Teste seus conhecimentos de valores
- **Jogo de Compaixão**: Escolhas baseadas em empatia
- **Histórias Reflexivas**: Analise parábolas
- **Simulador de Conflitos**: Resolva conflitos ethicamente

#### Informática
- **Quebra-Cabeças Lógico**: Resolva problemas de lógica
- **Jogo da Sequência**: Ordene instruções de código
- **Debugador**: Encontre erros no código
- **Jogo de Algoritmo**: Simule algoritmos simples

#### Espanhol
- **Conversa Rápida**: Chat rápido em espanhol
- **Teste de Vocabulário**: Pareie palavras em espanhol
- **Jogo de Conjugação**: Conjugue verbos em espanhol
- **Descobridor de Cultura**: Conheça fatos sobre países hispanohablantes

---

## 🏆 SISTEMA DE RECOMPENSAS AVANÇADO

### 1. **Badges (Conquistas Visuais)**
```
Por Matéria (13 matérias × 5 níveis = 65 badges):
- Iniciante (5 mensagens)
- Praticante (20 mensagens)
- Estudioso (50 mensagens)
- Expert (100 mensagens)
- Mestre Absoluto (200 mensagens)

Globais:
- Explorador: Converse com 5 avatares diferentes
- Polímata: Estude 7 matérias diferentes
- Pesquisador: Complete 3 cenários avançados
- Colecionador: Desbloqueie 20 badges
- Criador: Crie uma conversa que ganhe muitos upvotes
```

### 2. **Skins e Temas**
```
Skins de Avatares:
- Tema Neon (roxo/ciano)
- Tema Retro (8-bit)
- Tema Futurista (holografia)
- Tema Pixel Art
- Tema Anime

Temas da Interface:
- Dark Mode
- Light Mode
- Tema Cyberpunk
- Tema Natureza
- Tema Retro 80s
```

### 3. **Progression Path**
```
Leveltíes de XP:
1-10: Iniciante (0-5000 XP)
11-20: Intermediário (5000-20000 XP)
21-30: Avançado (20000-50000 XP)
31-40: Expert (50000-100000 XP)
41-50: Lendário (100000+ XP)

Cada nível debloqueia:
- Novos avatares (níveis 10, 20, 30, 40)
- Novos temas (níveis 5, 15, 25, 35, 45)
- Novos mini-games (níveis 3, 8, 13, 18, 23, etc)
```

### 4. **Streaks e Metas**
```
Streaks (dias consecutivos):
- 3 dias: Bônus +10% XP por 1 dia
- 7 dias: Badge "Semana Dourada" + Bônus +20%
- 14 dias: Badge "Forjador de Hábitos" + Skin especial
- 30 dias: Badge "Dedicação Infinita" + Avatar especial

Metas Semanais:
- Converse 30 min com 2 avatares diferentes
- Complete 1 mini-game em cada matéria
- Chegue ao nível 3 em um mini-game
```

---

## 🎨 ANIMAÇÕES E INTERATIVIDADE

### 1. **Entrada/Saída de Tela**
- Avatares entram com animação deslizante + fade-in
- Botões pulsam sutilmente quando ativo
- Cards rotacionam ao serem clicados

### 2. **Feedback Visual**
- Partículas de confete quando desblocar achievement
- Efeito de brilho quando ganhar XP
- Números flutuam para cima quando ganhar pontos
- Shake animation em erros

### 3. **Conversação**
- Avatar "pisca" quando ouvindo
- Balões de fala aparecem com animação
- Boca do avatar se move com o áudio
- Gestos do avatar mudam com sentimento (feliz/pensativo)

### 4. **Mini-games**
- Animação de spawn para novos elementos
- Transições suaves entre pergunta/resposta
- Barra de progresso animada
- Efeito de "sucesso" visual quando acertar

### 5. **Navegação**
- Transições de página suaves
- Scroll animado para próxima seção
- Modais com blur backdrop
- Tooltips aparecem com animação

---

## 📊 DASHBOARD DE PROGRESSO (NOVO)

### Página Principal do Aluno
```
Layout:
┌─────────────────────────────────────┐
│ Header: Olá [Nome]! Dia 5/7 🔥     │
├─────────────────────────────────────┤
│ Barra de XP Animada (nivel/progresso)│
├─────────────────────────────────────┤
│ 3 Cards Principais:                 │
│ ├─ Próximo Avatar Desbloqueado      │
│ ├─ Meta Semanal: 2/3 completa       │
│ └─ Novo Badge Próximo!              │
├─────────────────────────────────────┤
│ Grid de Matérias (13 itens):        │
│ ├─ Cada card mostra:                │
│ │  • Ícone + Nome                   │
│ │  • Progresso de aprendizado       │
│ │  • Próximo mini-game desbloqueado │
│ │  • Horário sugerido                │
│ └─ Cores diferentes por matéria     │
├─────────────────────────────────────┤
│ Seção "Continuar Aprendendo"        │
│ (últimas 3 interações)              │
├─────────────────────────────────────┤
│ Badges Recentes (4-5 últimas)       │
├─────────────────────────────────────┤
│ Rodapé: Rankings e Comunidade       │
└─────────────────────────────────────┘
```

### Página de Perfil Expandida
- Estatísticas detalhadas por matéria
- Gráfico de progresso ao longo do tempo
- Todas as badges desbloqueadas
- Histórico de conversas favoritas
- Amigos e ranking social

---

## 🎯 PLANO DE IMPLEMENTAÇÃO POR FASES

### FASE 1: FUNDAÇÃO (Semana 1-2)
**Objetivo**: Preparar estrutura e novos avatares

#### Tarefas:
1. **Expandir Banco de Dados**
   - Adicionar tabelas: `subjects`, `mini_games`, `badges`, `achievements_v2`, `user_preferences`
   - Migrations e seeds com 13 matérias

2. **Criar 10 Novos Avatares**
   - Definir personalidades e prompts
   - Organizar vozes por idioma/matéria
   - Criar estrutura de dados escalável

3. **Atualizar lib/avatars.ts**
   - Adicionar todos os 13 avatares
   - Funções auxiliares para filtrar por tipo/matéria
   - Validações

4. **Estrutura de Componentes**
   - Novo component: `SubjectGrid.tsx` (grid de matérias)
   - Novo component: `ProgressDashboard.tsx` (dashboard principal)
   - Novo component: `MiniGameWrapper.tsx` (container genérico)

---

### FASE 2: MINI-GAMES BÁSICOS (Semana 3-4)
**Objetivo**: Implementar estrutura e 3 mini-games iniciais

#### Tarefas:
1. **Estrutura Genérica de Mini-Games**
   - Hook: `useMiniGame.ts` (estado, pontos, timer)
   - Component: `MiniGameContainer.tsx` (UI compartilhada)
   - Types: `miniGames.ts` (interfaces)

2. **Implementar 3 Mini-Games Piloto**
   - Quiz Relâmpago (Matemática)
   - Corrector de Textos (Português)
   - Timeline Interativa (História)

3. **Sistema de Pontos**
   - Lógica de XP por mini-game
   - Bônus por streak/velocidade
   - API endpoint: `POST /api/mini-games/complete`

---

### FASE 3: GAMIFICAÇÃO AVANÇADA (Semana 5-6)
**Objetivo**: Badges, streaks, progressão

#### Tarefas:
1. **Sistema de Badges**
   - Component: `BadgesDisplay.tsx`
   - Hook: `useBadges.ts` (unlock logic)
   - API: `POST /api/badges/unlock`

2. **Streak System**
   - Hook: `useStreaks.ts`
   - Visual: Contador de fogo animado
   - Notificações quando atingir milestones

3. **Metas Semanais**
   - Component: `WeeklyGoals.tsx`
   - Lógica de reset semanal
   - API de sincronização

4. **Progression UI**
   - Componente: `LevelBar.tsx` (animado)
   - Visualização de próximo unlock
   - Pop-ups de celebração

---

### FASE 4: DASHBOARD E NAVEGAÇÃO (Semana 7-8)
**Objetivo**: Nova UI principal com 13 matérias

#### Tarefas:
1. **Dashboard Principal**
   - Refatorar `page.tsx` com nova estrutura
   - Component: `StudentDashboard.tsx`
   - SubjectCard com progresso individual

2. **Navegação Revamp**
   - Menu melhorado com todas matérias
   - Search/filter de avatares
   - Recomendações personalizadas

3. **Página de Matéria**
   - View: `app/subject/[id]/page.tsx`
   - Mostrar avatar + cenários + mini-games
   - Histórico de interações

4. **Perfil do Aluno Expandido**
   - Estatísticas por matéria
   - Gráficos de progresso
   - Preferences (tema, idioma)

---

### FASE 5: ANIMAÇÕES E POLISH (Semana 9-10)
**Objetivo**: Tornar experiência fluida e bonita

#### Tarefas:
1. **Animações Globais**
   - Setup Framer Motion avançado
   - Variants reutilizáveis
   - Efeitos de transição

2. **Feedback Visual**
   - Partículas de XP (React Particles)
   - Efeito de brilho em achievements
   - Shake em erros

3. **Avatar Animations**
   - Gestos básicos (piscar, acenar)
   - Sincronização com áudio
   - Estados emocionais

4. **Loading States**
   - Skeletons customizados
   - Progress indicators
   - Animations durante carregamento

---

### FASE 6: MINI-GAMES COMPLETOS (Semana 11-14)
**Objetivo**: Todos os 52 mini-games (4 por matéria)

#### Tarefas por Matéria:
- Quiz Interativo (base: Quiz Relâmpago)
- Jogo de Arrastar (Molecules, Regions, etc)
- Jogo de Sequência (Timeline, Ritmo, etc)
- Jogo de Pareamento (Vocabulary, Colors, etc)

**Estrutura**:
- `components/miniGames/[subject]/` (um componente por mini-game)
- `hooks/miniGames/` (lógica reutilizável)
- `lib/miniGames/` (dados e configurações)

---

### FASE 7: COMUNIDADE E RANKINGS (Semana 15-16)
**Objetivo**: Competição e interação social

#### Tarefas:
1. **Rankings Globais**
   - Leaderboard por matéria
   - Leaderboard geral (XP total)
   - Rankings semanais/mensais

2. **Desafios Comunitários**
   - Desafios diários (tema rotativo)
   - Pontos bônus para desafios
   - Badges especiais de participação

3. **Arena de Batalhas** (Avançado)
   - 1v1 contra IA em tempo real
   - Responde perguntas do adversário
   - Competição síncrona

4. **Social Features**
   - Amigos (follow/unfollow)
   - Compartilhar achievements
   - Sistema de comentários

---

### FASE 8: REFINAMENTO FINAL (Semana 17-18)
**Objetivo**: QA, otimização, deploy

#### Tarefas:
1. **Testing**
   - Testes unitários (mini-games, gamification)
   - Testes E2E (fluxos principais)
   - Teste de performance

2. **Otimizações**
   - Lazy loading de componentes
   - Caching de dados
   - Compressão de imagens

3. **Documentação**
   - README atualizado
   - Guia de usuário
   - Documentação técnica

4. **Deploy**
   - Setup Vercel/Netlify
   - Configuração de domínio
   - CI/CD pipeline

---

## 📁 NOVA ESTRUTURA DE PASTAS

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx (novo - tela principal)
│   │   └── layout.tsx
│   ├── subject/
│   │   ├── [id]/
│   │   │   ├── page.tsx (novo)
│   │   │   └── mini-games/
│   │   │       └── [gameId]/page.tsx
│   │   └── page.tsx (listagem)
│   ├── profile/
│   │   ├── page.tsx (novo - perfil expandido)
│   │   └── settings/page.tsx (novo)
│   ├── leaderboard/
│   │   └── page.tsx (novo)
│   └── api/
│       ├── mini-games/ (novo)
│       ├── badges/ (novo)
│       ├── streaks/ (novo)
│       └── [outros APIs]
│
├── components/
│   ├── dashboard/
│   │   ├── StudentDashboard.tsx (novo)
│   │   ├── SubjectGrid.tsx (novo)
│   │   ├── ProgressCard.tsx (novo)
│   │   └── WeeklyGoals.tsx (novo)
│   ├── miniGames/ (novo - pasta container)
│   │   ├── MiniGameContainer.tsx
│   │   ├── [subject]/
│   │   │   ├── QuizGame.tsx
│   │   │   ├── DragDropGame.tsx
│   │   │   └── ...
│   │   └── shared/
│   │       ├── GameHeader.tsx
│   │       ├── ScoreBoard.tsx
│   │       └── ResultModal.tsx
│   ├── gamification/ (novo - refatorado)
│   │   ├── BadgesDisplay.tsx
│   │   ├── StreakCounter.tsx
│   │   ├── LevelBar.tsx (novo)
│   │   └── AchievementPopup.tsx (novo)
│   ├── profile/ (novo)
│   │   ├── ProfileCard.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── BadgesCollection.tsx
│   │   └── PreferencesPanel.tsx
│   ├── leaderboard/ (novo)
│   │   ├── LeaderboardTable.tsx
│   │   ├── RankCard.tsx
│   │   └── FilterTabs.tsx
│   └── ui/
│       ├── [existentes]
│       ├── avatar-selector.tsx (novo)
│       └── stat-card.tsx (novo)
│
├── hooks/ (novo/expandido)
│   ├── useMiniGame.ts (novo)
│   ├── useBadges.ts (novo)
│   ├── useStreaks.ts (novo)
│   ├── useProgress.ts (novo)
│   ├── useLeaderboard.ts (novo)
│   └── [existentes]
│
├── lib/
│   ├── avatars.ts (expandido - 13 avatares)
│   ├── scenarios.ts (expandido)
│   ├── miniGames.ts (novo - configurações)
│   ├── gamification.ts (expandido)
│   ├── badges.ts (novo)
│   ├── subjects.ts (novo - mapear matérias)
│   ├── animations.ts (novo - variants Framer Motion)
│   └── [existentes]
│
├── services/
│   ├── miniGames.ts (novo)
│   ├── badges.ts (novo)
│   ├── leaderboard.ts (novo)
│   └── [existentes]
│
├── types/
│   ├── index.ts (expandido)
│   ├── miniGames.ts (novo)
│   ├── achievements.ts (novo)
│   └── [existentes]
│
└── styles/
    ├── globals.css (expandido)
    └── animations.css (novo)
```

---

## 🛠️ STACK TECNOLÓGICO FINAL

### Frontend
- **Next.js 16** - Framework (APP Router)
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animações avançadas
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Sonner** - Toasts/Notifications
- **React Particles** (novo) - Efeitos visuais
- **Recharts** (novo) - Gráficos de progresso

### Backend
- **Next.js API Routes** - APIs
- **Groq SDK** - LLM conversação
- **Google Cloud TTS** - Síntese de voz
- **Whisper/Deepgram** - STT

### Dados
- **PostgreSQL** - Database
- **Supabase** - Backend as a Service
- **Prisma** (novo - optional) - ORM

### DevOps
- **Vercel** - Deployment
- **GitHub** - Versionamento
- **GitHub Actions** (novo) - CI/CD

---

## 💾 BANCO DE DADOS - NOVAS TABELAS

```sql
-- Matérias
CREATE TABLE subjects (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    color_hex VARCHAR(7),
    icon_name VARCHAR(50),
    description TEXT,
    grade_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mini-games
CREATE TABLE mini_games (
    id UUID PRIMARY KEY,
    subject_id UUID REFERENCES subjects(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- 'quiz', 'drag-drop', 'sequence', 'matching'
    difficulty VARCHAR(20),
    estimated_duration_minutes INTEGER,
    max_score INTEGER,
    config JSONB, -- Configurações específicas do jogo
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges (sistema expandido)
CREATE TABLE badges_v2 (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    emoji VARCHAR(10),
    category VARCHAR(50), -- 'subject_master', 'achievement', 'special'
    unlock_condition JSONB,
    reward_xp INTEGER,
    rarity VARCHAR(20), -- 'common', 'rare', 'epic', 'legendary'
    subject_id UUID REFERENCES subjects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges (earned)
CREATE TABLE user_badges (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    badge_id UUID REFERENCES badges_v2(id),
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Mini-game completions
CREATE TABLE mini_game_completions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    mini_game_id UUID REFERENCES mini_games(id),
    score INTEGER,
    time_taken_seconds INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User streaks
CREATE TABLE user_streaks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_interaction_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Weekly goals
CREATE TABLE weekly_goals (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    week_start_date DATE,
    goals JSONB, -- { "goal_id": { "title": "...", "target": 3, "current": 2 } }
    completed_goals INTEGER DEFAULT 0,
    total_goals INTEGER,
    xp_reward INTEGER,
    week_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    theme VARCHAR(20), -- 'light', 'dark', 'cyberpunk', etc
    animation_enabled BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    notification_enabled BOOLEAN DEFAULT true,
    preferred_subjects TEXT[],
    language_preference VARCHAR(10),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);
```

---

## 🎬 EXEMPLOS DE FLUXOS PRINCIPAIS

### Fluxo 1: Aluno Começa a Estudar Matemática
```
1. Aluno entra no dashboard
2. Vê grid de 13 matérias, clica em Matemática
3. Vê Prof. Carlos + 3 opções:
   - Conversa Livre (chat)
   - Cenários (5 opções)
   - Mini-games (4 opções)
4. Escolhe "Quiz Relâmpago"
5. Joga 5 perguntas contra cronômetro
6. Ganha 50 XP + 10 bônus por velocidade
7. Desbloqueio de "Iniciante em Matemática" badge
8. Volta ao dashboard, vê notificação de badge
9. Próximo avatar desbloqueado (próximo nível)
```

### Fluxo 2: Aluno Completa Streak de 7 dias
```
1. Aluno estuda dia 1-6
2. Dia 7: Flame icon aparece "5/7 🔥"
3. Estuda e interage com qualquer avatar
4. Ao desbloquear, pop-up de celebração
5. Ganha badge "Semana Dourada" + bônus skin
6. Streak visual animada conta para cima
7. Desbloqueado novo tema "Neon Mode"
```

### Fluxo 3: Aluno no Leaderboard
```
1. Aluno clica em "Rankings" no menu
2. Vê leaderboard global e por matéria
3. Seu rank destacado com animação
4. Filtro por semana/mês/all-time
5. Pode ver perfil de outros usuários
6. Vê badges dos competidores
7. Aceita "Desafio Diário" para ganhar pontos extras
```

---

## 📈 MÉTRICAS DE SUCESSO

### Fase 1-8 (18 semanas)
- ✅ 13 avatares implementados
- ✅ 52 mini-games funcionais (4 × 13)
- ✅ 65 badges desbloqueáveis
- ✅ Sistema de gamificação completo
- ✅ Dashboard intuitivo
- ✅ 100+ horas de conteúdo educacional

### KPIs
- Tempo médio de sessão: 20+ minutos
- Retenção diária (DAU): 60%+
- Retenção semanal (WAU): 80%+
- Score satisfação (1-5): 4.5+
- Badges desbloqueadas por usuário: 10+

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

### Esta Semana:
1. ✅ Revisar este plano com o time
2. ✅ Expandir `lib/avatars.ts` com 10 novos avatares
3. ✅ Criar tabelas no banco de dados
4. ✅ Iniciar primeiro componente de dashboard

### Próximas 2 Semanas:
1. Implementar estrutura base de mini-games
2. Criar 3 primeiros mini-games piloto
3. Sistema de XP/badges básico
4. UI dashboard principal

---

## 📞 NOTAS ADICIONAIS

- **Acessibilidade**: Todos componentes com ARIA labels
- **Performance**: Lazy load de mini-games, virtual scrolling
- **Segurança**: Rate limiting em APIs, validação de inputs
- **SEO**: Metadados dinâmicos, Open Graph
- **Analytics**: Tracking de eventos (Plausible/Vercel Analytics)
- **i18n**: Preparado para múltiplos idiomas (já tem pt-BR, en-US)

---

**Última atualização:** Fevereiro 15, 2026  
**Versão do Documento:** 1.0
