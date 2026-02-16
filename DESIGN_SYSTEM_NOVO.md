# 🎨 Design System Repaginado - AvatarES

## Overview

O design do AvatarES foi completamente repaginado para ser **intuitivo, divertido e visualmente distintivo**. Cada matéria agora tem sua própria identidade visual clara com cores, gradientes, padrões e animações únicas.

---

## 📊 Temas por Matéria

### 1. **Matemática** 🔢
- **Cores**: Vermelho (#FF6B6B) → Gradiente vermelho quente
- **Padrão**: Grid (grade)
- **Ícone Secundário**: 📐
- **Personalidade**: Precisa, estruturada, desafiadora
- **Efeito Hover**: Anima para cima com glow vermelho

### 2. **Português** 📖
- **Cores**: Teal (#4ECDC4) → Gradiente azul-turquesa
- **Padrão**: Lines (linhas diagonais)
- **Ícone Secundário**: ✍️
- **Personalidade**: Fluida, criativa, literária
- **Efeito Hover**: Desliza suavemente com glow turquesa

### 3. **Ciências** 🔬
- **Cores**: Azul céu (#45B7D1) → Gradiente azul claro
- **Padrão**: Molecules (moléculas/átomos)
- **Ícone Secundário**: ⚗️
- **Personalidade**: Experimental, exploratória
- **Efeito Hover**: Anima com brilho azul

### 4. **História** 📜
- **Cores**: Marrom antigo (#A67C52) → Gradiente âmbar
- **Padrão**: Scroll (pergaminho)
- **Ícone Secundário**: 🏛️
- **Personalidade**: Clássica, nostálgica, reverente
- **Efeito Hover**: Efeito sepia com glow quente

### 5. **Geografia** 🌍
- **Cores**: Verde (#26C485) → Gradiente esmeralda
- **Padrão**: Map (mapa)
- **Ícone Secundário**: 🗺️
- **Personalidade**: Aventureira, exploratória, expansiva
- **Efeito Hover**: Anima com glow verde

### 6. **Inglês** 🇬🇧
- **Cores**: Roxo (#5B21B6) → Gradiente roxo profundo
- **Padrão**: Language (símbolos de linguagem)
- **Ícone Secundário**: 💬
- **Personalidade**: Elegante, internacional, sofisticada
- **Efeito Hover**: Anima com brilho roxo

### 7. **Educação Física** ⚽
- **Cores**: Laranja (#F77F00) → Gradiente laranja vibrante
- **Padrão**: Sports (padrão de movimento)
- **Ícone Secundário**: 🏃
- **Personalidade**: Energética, motivadora, ativa
- **Efeito Hover**: Anima com glow laranja

### 8. **Arte** 🎨
- **Cores**: Rosa (#E91E63) → Gradiente rosa/magenta
- **Padrão**: Paint (pinceladas)
- **Ícone Secundário**: 🖌️
- **Personalidade**: Criativa, expressiva, livre
- **Efeito Hover**: Anima com brilho rosa

### 9. **Música** 🎵
- **Cores**: Fúcsia (#9C27B0) → Gradiente roxo/fúcsia
- **Padrão**: Notes (notas musicais)
- **Ícone Secundário**: 🎼
- **Personalidade**: Rítmica, harmoniosa, emocionante
- **Efeito Hover**: Anima com glow fúcsia

### 10. **Filosofia** 🤔
- **Cores**: Violeta (#7C3AED) → Gradiente violeta vibrante
- **Padrão**: Thinking (pensamento)
- **Ícone Secundário**: 💭
- **Personalidade**: Reflexiva, contemplativa, profunda
- **Efeito Hover**: Anima com brilho violeta

### 11. **Religião/Ética** ☮️
- **Cores**: Ciano (#06B6D4) → Gradiente ciano claro
- **Padrão**: Harmony (harmonia/padrão)
- **Ícone Secundário**: 🙏
- **Personalidade**: Serena, harmoniosa, equilibrada
- **Efeito Hover**: Anima com glow ciano

### 12. **Informática** 💻
- **Cores**: Teal escuro (#0F766E) → Gradiente teal profundo
- **Padrão**: Code (código/símbolos)
- **Ícone Secundário**: ⌨️
- **Personalidade**: Técnica, moderna, futurista
- **Efeito Hover**: Anima com brilho teal

### 13. **Espanhol** 🇪🇸
- **Cores**: Rose (#EC4899) → Gradiente rose vibrante
- **Padrão**: Fiesta (celebração)
- **Ícone Secundário**: 🎭
- **Personalidade**: Alegre, festiva, calorosa
- **Efeito Hover**: Anima com glow rose

---

## 🎯 Componentes Visuais

### **SubjectGrid**
- **Grid Responsivo**: 1 coluna (mobile) → 4 colunas (desktop)
- **Cards Personalizados**: Cada card é um bloco colorido único
- **Animações**:
  - Entrada: Scale + fade com stagger (0.06s entre cada)
  - Hover: Elevação (-12px) com sombra com glow
  - Emoji: Scale animado no hover
  - Progress bar: Width animation smooth
- **Indicador Seleção**: Badge branco com checkmark no canto superior direito
- **Informações**: XP, Nível, Jogos, Avatar, Progresso (%)

### **StudentDashboard**
- **Background**: Gradiente azul → indigo → roxo com animated blobs
- **Hero Header**: Título grande com gradiente + subtitle
- **Stat Cards (4+3)**:
  - 4 principais: XP, Nível, Badges, Sequência (2x2 grid)
  - 3 secundários: Ranking, Mini-games, Matérias (1x3)
  - Cada card tem gradiente único e animação de valor
- **Subject Grid**: Centralizado em container com glassmorphism
- **CTA Flutuante**: Botão "Começar Mini-game" fixo no bottom (quando subject selecionado)

### **PageHeader**
- **Componente Reutilizável** para páginas
- Emoji animado (rotating)
- Título grande com gradiente
- Subtitle descritivo
- Action button opcional

### **FloatingCard**
- **2 Variantes**:
  - Featured: Card grande (h-64) com gradient e shine effect
  - Compact: Card pequeno com stats
- **Animação Hover**: Elevação com shadow glow

### **AmbientParticles**
- Emojis flutuantes de baixo pra cima
- Aleatórios: ⭐✨🎓🎯🏆💡🚀⚡
- Loop infinito

---

## 🎬 Animações Principais

### **Entrada de Cards**
```
opacity: 0 → 1
y: 30px → 0
scale: 0.9 → 1
duration: ~0.6s (spring)
stagger: 0.06s entre cards
```

### **Hover em Cards**
```
y: 0 → -12px
boxShadow: default → glow color
transition: spring (stiffness: 300)
```

### **Progress Bar**
```
width: 0% → target%
delay: 0.2s após card enter
smooth spring animation
```

### **Stats Bounce**
```
scale: 1 → 1.2 → 1
duration: 0.5s
ao atualizar valor
```

### **Emoji Rotate**
```
rotate: 0° → 5° → -5° → 0°
duration: 4s
repeat: infinity
```

---

## 🎨 Palette de Cores

```
Primária: Azul-Indigo-Roxo Gradient
Secundária: Cor única por matéria
Accent: Branco/glow da matéria
Background: Gradiente suave por página
Dark Mode: Cinzas escuros + gradientes mantidos
```

---

## 📱 Responsividade

### **Desktop (lg+)**
- Subject Grid: 4 colunas
- Stats: 4+3 cards visíveis
- Header: Full width com espaço

### **Tablet (md)**
- Subject Grid: 2-3 colunas
- Stats: 2+2 ou 2+3 layout
- Header: Comprimido

### **Mobile (sm)**
- Subject Grid: 1 coluna (full width)
- Stats: 2x2 + 3x1 stacked
- Header: Stack vertical emoji+title

---

## 🔄 Padrões SVG

Cada matéria possui um padrão SVG único que aparece como background overlay:

- **Grid**: Grade quadriculada fina
- **Lines**: Linhas diagonais
- **Molecules**: Pontos conectados
- **Scroll**: Textura de pergaminho
- **Map**: Padrão de mapa
- **Language**: Símbolos de idioma
- **Sports**: Padrão de movimento/traços
- **Paint**: Pinceladas aleatórias
- **Notes**: Notas musicais
- **Thinking**: Símbolos de pensamento
- **Harmony**: Padrão harmônico/mandala
- **Code**: Símbolos de código
- **Fiesta**: Confete/padrão festivo

---

## ✨ Glassmorphism

SubjectGrid e containers principais usam:
```
background: rgba(255, 255, 255, 0.4) / rgba(0, 0, 0, 0.4)
backdrop-filter: blur(10px)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: 1.5rem
```

---

## 🌓 Dark Mode

Todas as cores adaptam automaticamente com Tailwind `dark:`:
- Backgrounds mais escuros
- Textos mais claros
- Gradientes mantêm tom mas ajustam brilho
- Padrões SVG ajustam opacidade

---

## 📚 Arquivo de Referência

`src/lib/designSystem.ts` contém:
- `SUBJECT_THEMES`: Objeto com temas de cada matéria
- `getSubjectTheme()`: Função para acessar tema por ID

---

## 🎯 Benefícios da Repaginação

✅ **Intuitivo**: Cada matéria é visualmente única e reconhecível
✅ **Divertido**: Animações suaves e envolventes
✅ **Acessível**: Cores contrastantes e padrões adicionais além de cor
✅ **Responsivo**: Funciona perfeitamente em todos os devices
✅ **Moderno**: Glassmorphism, gradientes, animações spring
✅ **Escalável**: Fácil adicionar novos temas

---

## 🚀 Próximas Melhorias

- [ ] Adicionar sons ao hover (opcional)
- [ ] Efeitos 3D com Framer Motion
- [ ] Temas especiais por conquistas
- [ ] Customização de cores by user
- [ ] Modo "jogo" com efeitos especiais
