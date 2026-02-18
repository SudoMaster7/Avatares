// Mini-games database with 65+ games across 13 subjects
// Estrategicamente distribuídos com diferentes tipos de jogos para máximo engajamento

export interface MiniGameData {
  id: string;
  subject: string;
  type: 'dragdrop' | 'wordscramble' | 'memory' | 'timeline' | 'speedchallenge' | 'puzzle' | 'quiz' | 'truefalse' | 'fillblank';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Array<{
    id?: string;
    question?: string;
    options?: string[];
    correctAnswer?: string;
    items?: string[];
    categories?: { [key: string]: string[] }; // For dragdrop categorization
    events?: Array<{ event: string; order: number }>;
    hint?: string;
    image?: string;
  }>;
  maxScore: number;
  timeLimit?: number; // in seconds
  streakBonus?: boolean;
  speedBonus?: boolean;
}

export const MINIGAMES_DB: MiniGameData[] = [
  // ========== MATEMÁTICA (5 games) ==========
  {
    id: 'math-speed-1',
    subject: 'Matemática',
    type: 'speedchallenge',
    title: 'Speed Math - Operações Básicas',
    description: 'Resolva 10 operações matemáticas o mais rápido possível',
    difficulty: 'beginner',
    maxScore: 1000,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: '7 + 5 = ?', options: ['11', '12', '13', '14'], correctAnswer: '12' },
      { question: '15 - 8 = ?', options: ['7', '8', '9', '10'], correctAnswer: '7' },
      { question: '6 × 7 = ?', options: ['42', '43', '40', '41'], correctAnswer: '42' },
      { question: '24 ÷ 4 = ?', options: ['6', '7', '5', '8'], correctAnswer: '6' },
      { question: '9 + 9 = ?', options: ['18', '17', '19', '20'], correctAnswer: '18' },
      { question: '20 - 11 = ?', options: ['9', '10', '8', '11'], correctAnswer: '9' },
      { question: '8 × 8 = ?', options: ['64', '63', '62', '65'], correctAnswer: '64' },
      { question: '36 ÷ 6 = ?', options: ['6', '5', '7', '4'], correctAnswer: '6' },
      { question: '12 + 13 = ?', options: ['25', '24', '26', '23'], correctAnswer: '25' },
      { question: '30 - 17 = ?', options: ['13', '14', '12', '15'], correctAnswer: '13' },
    ],
  },
  {
    id: 'math-puzzle-1',
    subject: 'Matemática',
    type: 'puzzle',
    title: 'Montando Fórmulas',
    description: 'Organize os fragmentos para formar fórmulas matemáticas corretas',
    difficulty: 'intermediate',
    maxScore: 500,
    questions: [
      {
        items: ['A = ', 'b × h', ' ÷ 2'],
        correctAnswer: 'A = b × h ÷ 2',
      },
      {
        items: ['V = ', 'π × r²', ' × h'],
        correctAnswer: 'V = π × r² × h',
      },
      {
        items: ['E = ', 'm × c²', ''],
        correctAnswer: 'E = m × c²',
      },
    ],
  },
  {
    id: 'math-memory-1',
    subject: 'Matemática',
    type: 'memory',
    title: 'Memória de Números',
    description: 'Encontre os pares de operações e resultados',
    difficulty: 'beginner',
    maxScore: 800,
    questions: [
      { id: 'math-mem-1-1', question: '5 + 3', correctAnswer: '8', options: [] },
      { id: 'math-mem-1-2', question: '10 - 2', correctAnswer: '8', options: [] },
      { id: 'math-mem-1-3', question: '2 × 4', correctAnswer: '8', options: [] },
      { id: 'math-mem-1-4', question: '6 + 7', correctAnswer: '13', options: [] },
      { id: 'math-mem-1-5', question: '3 × 5', correctAnswer: '15', options: [] },
      { id: 'math-mem-1-6', question: '20 ÷ 4', correctAnswer: '5', options: [] },
    ],
  },
  {
    id: 'math-dragdrop-1',
    subject: 'Matemática',
    type: 'dragdrop',
    title: 'Classificando Números',
    description: 'Separe os números em pares e ímpares',
    difficulty: 'beginner',
    maxScore: 600,
    questions: [
      {
        items: ['2', '5', '8', '11', '14', '17', '20', '23'],
        categories: { 'Pares': ['2', '8', '14', '20'], 'Ímpares': ['5', '11', '17', '23'] },
      },
    ],
  },
  {
    id: 'math-wordscramble-1',
    subject: 'Matemática',
    type: 'wordscramble',
    title: 'Termos Matemáticos',
    description: 'Desembaralhe palavras relacionadas à matemática',
    difficulty: 'intermediate',
    maxScore: 500,
    questions: [
      { question: 'ETNEICOUQ', correctAnswer: 'QUOCIENTE', hint: 'Resultado de uma divisão' },
      { question: 'AIRETMOGE', correctAnswer: 'GEOMETRIA', hint: 'Estudo de formas' },
      { question: 'OLUGNAIRТ', correctAnswer: 'TRIÂNGULO', hint: 'Figura com 3 lados' },
    ],
  },

  // ========== PORTUGUÊS (5 games) ==========
  {
    id: 'português-wordscramble-1',
    subject: 'Português',
    type: 'wordscramble',
    title: 'Desembaralhe Palavras',
    description: 'Organize as letras para formar palavras em português',
    difficulty: 'beginner',
    maxScore: 700,
    questions: [
      { question: 'LAROFЛЪ', correctAnswer: 'FLORAL', hint: 'Relacionado com flores' },
      { question: 'OTÁBAS', correctAnswer: 'SÁBADO', hint: 'Dia da semana' },
      { question: 'ADITNAMUH', correctAnswer: 'HUMANIDADE', hint: 'Qualidade de ser humano' },
    ]
  },
  {
    id: 'português-memory-1',
    subject: 'Português',
    type: 'memory',
    title: 'Sinônimos',
    description: 'Encontre pares de palavras com significados semelhantes',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'pt-mem-1-1', question: 'Feliz', correctAnswer: 'Alegre', options: [] },
      { id: 'pt-mem-1-2', question: 'Grande', correctAnswer: 'Enorme', options: [] },
      { id: 'pt-mem-1-3', question: 'Triste', correctAnswer: 'Melancólico', options: [] },
      { id: 'pt-mem-1-4', question: 'Rápido', correctAnswer: 'Veloz', options: [] },
      { id: 'pt-mem-1-5', question: 'Bonito', correctAnswer: 'Lindo', options: [] },
      { id: 'pt-mem-1-6', question: 'Pequeno', correctAnswer: 'Minúsculo', options: [] },
    ],
  },
  {
    id: 'português-speed-1',
    subject: 'Português',
    type: 'speedchallenge',
    title: 'Classificação Gramatical Rápida',
    description: 'Identifique a classe gramatical das palavras',
    difficulty: 'intermediate',
    maxScore: 900,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Qual é a classe de "rápido"?', options: ['Adjetivo', 'Verbo', 'Advérbio', 'Substantivo'], correctAnswer: 'Adjetivo' },
      { question: 'Qual é a classe de "correr"?', options: ['Verbo', 'Adjetivo', 'Substantivo', 'Preposição'], correctAnswer: 'Verbo' },
      { question: 'Qual é a classe de "rapidamente"?', options: ['Advérbio', 'Adjetivo', 'Verbo', 'Substantivo'], correctAnswer: 'Advérbio' },
      { question: 'Qual é a classe de "gato"?', options: ['Substantivo', 'Adjetivo', 'Verbo', 'Pronome'], correctAnswer: 'Substantivo' },
    ],
  },
  {
    id: 'português-timeline-1',
    subject: 'Português',
    type: 'timeline',
    title: 'Ordem da Narrativa',
    description: 'Ordene os eventos em sequência cronológica',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        events: [
          { event: 'Coroação do Rei', order: 2 },
          { event: 'Nascimento do Rei', order: 1 },
          { event: 'Morte do Rei', order: 3 },
        ],
      },
    ],
  },
  {
    id: 'português-dragdrop-1',
    subject: 'Português',
    type: 'dragdrop',
    title: 'Categorias de Palavras',
    description: 'Classifique palavras em suas categorias corretas',
    difficulty: 'beginner',
    maxScore: 600,
    questions: [
      {
        items: ['gato', 'vermelho', 'corrida', 'rápido', 'cão', 'azul'],
        categories: {
          'Cores': ['vermelho', 'azul'],
          'Animais': ['gato', 'cão'],
          'Qualidades': ['rápido'],
          'Ações': ['corrida'],
        },
      },
    ],
  },

  // ========== ENGLISH (5 games) ==========
  {
    id: 'english-wordscramble-1',
    subject: 'English',
    type: 'wordscramble',
    title: 'Unscramble English Words',
    description: 'Arrange letters to form correct English words',
    difficulty: 'beginner',
    maxScore: 700,
    questions: [
      { question: 'HSOUE', correctAnswer: 'HOUSE', hint: 'A place where people live' },
      { question: 'COLSH', correctAnswer: 'SCHOOL', hint: 'Where students learn' },
      { question: 'FEIRDN', correctAnswer: 'FRIEND', hint: 'Someone you like' },
    ],
  },
  {
    id: 'english-speed-1',
    subject: 'English',
    type: 'speedchallenge',
    title: 'Quick Vocabulary',
    description: 'Answer vocabulary questions as fast as you can',
    difficulty: 'intermediate',
    maxScore: 900,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'What is the past tense of "eat"?', options: ['ate', 'eated', 'eating', 'eats'], correctAnswer: 'ate' },
      { question: 'What is the opposite of "hot"?', options: ['cold', 'warm', 'cool', 'frozen'], correctAnswer: 'cold' },
      { question: 'Which word means "very happy"?', options: ['joyful', 'sad', 'angry', 'tired'], correctAnswer: 'joyful' },
    ],
  },
  {
    id: 'english-memory-1',
    subject: 'English',
    type: 'memory',
    title: 'Match Synonyms',
    description: 'Find pairs of words with similar meanings',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'en-mem-1-1', question: 'Big', correctAnswer: 'Large', options: [] },
      { id: 'en-mem-1-2', question: 'Happy', correctAnswer: 'Joyful', options: [] },
      { id: 'en-mem-1-3', question: 'Sad', correctAnswer: 'Unhappy', options: [] },
      { id: 'en-mem-1-4', question: 'Fast', correctAnswer: 'Quick', options: [] },
      { id: 'en-mem-1-5', question: 'Smart', correctAnswer: 'Intelligent', options: [] },
      { id: 'en-mem-1-6', question: 'Beautiful', correctAnswer: 'Pretty', options: [] },
    ],
  },
  {
    id: 'english-timeline-1',
    subject: 'English',
    type: 'timeline',
    title: 'Story Sequence',
    description: 'Put story events in the correct order',
    difficulty: 'beginner',
    maxScore: 700,
    questions: [
      {
        events: [
          { event: 'Alice found a rabbit hole', order: 1 },
          { event: 'Alice fell down the hole', order: 2 },
          { event: 'Alice met the Queen', order: 3 },
        ],
      },
    ],
  },
  {
    id: 'english-puzzle-1',
    subject: 'English',
    type: 'puzzle',
    title: 'Build Sentences',
    description: 'Arrange words to form correct sentences',
    difficulty: 'beginner',
    maxScore: 600,
    questions: [
      {
        items: ['I', 'love', 'reading', 'books'],
        correctAnswer: 'I love reading books',
      },
    ],
  },

  // ========== HISTÓRIA (5 games) ==========
  {
    id: 'historia-timeline-1',
    subject: 'História',
    type: 'timeline',
    title: 'Linha do Tempo Brasileira',
    description: 'Ordene os principais eventos da história do Brasil',
    difficulty: 'intermediate',
    maxScore: 900,
    questions: [
      {
        events: [
          { event: 'Chegada de Cabral', order: 1 },
          { event: 'Independência do Brasil', order: 2 },
          { event: 'Abolição da Escravidão', order: 3 },
          { event: 'Proclamação da República', order: 4 },
        ],
      },
    ],
  },
  {
    id: 'historia-memory-1',
    subject: 'História',
    type: 'memory',
    title: 'Personagens Históricos',
    description: 'Encontre pares de personagens e suas realizações',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'hist-mem-1-1', question: 'Tiradentes', correctAnswer: 'Líder da Inconfidência Mineira', options: [] },
      { id: 'hist-mem-1-2', question: 'Princesa Isabel', correctAnswer: 'Assinou a Lei Áurea', options: [] },
      { id: 'hist-mem-1-3', question: 'Pedro Álvares Cabral', correctAnswer: 'Descobrimento', options: [] },
      { id: 'hist-mem-1-4', question: '1822', correctAnswer: 'Independência', options: [] },
    ],
  },
  {
    id: 'historia-dragdrop-1',
    subject: 'História',
    type: 'dragdrop',
    title: 'Classificando Períodos',
    description: 'Classifique eventos em seus períodos históricos',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        items: ['Navegações Portuguesas', 'Revolução Industrial', 'Pedra Lascada', 'Internet'],
        categories: {
          'Pré-História': ['Pedra Lascada'],
          'Idade Média': ['Navegações Portuguesas'],
          'Idade Moderna': ['Revolução Industrial'],
          'Contemporânea': ['Internet'],
        },
      },
    ],
  },
  {
    id: 'historia-speed-1',
    subject: 'História',
    type: 'speedchallenge',
    title: 'Datas Importantes',
    description: 'Responda rápido sobre datas históricas importantes',
    difficulty: 'advanced',
    maxScore: 1000,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Em que ano o Brasil foi descoberto?', options: ['1500', '1505', '1510', '1520'], correctAnswer: '1500' },
      { question: 'Em que ano foi a independência?', options: ['1822', '1820', '1825', '1830'], correctAnswer: '1822' },
      { question: 'Em que ano foi a abolição?', options: ['1888', '1885', '1890', '1880'], correctAnswer: '1888' },
    ],
  },
  {
    id: 'historia-puzzle-1',
    subject: 'História',
    type: 'puzzle',
    title: 'Montando Narrativas',
    description: 'Organize fragmentos para contar uma história histórica',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        items: ['Os descobridores', 'chegaram ao Brasil', 'em 1500', 'por mar'],
        correctAnswer: 'Os descobridores chegaram ao Brasil em 1500 por mar',
      },
    ],
  },

  // ========== CIÊNCIAS (5 games) ==========
  {
    id: 'ciencias-memory-1',
    subject: 'Ciências',
    type: 'memory',
    title: 'Componentes Celulares',
    description: 'Encontre pares de organelas celulares e suas funções',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'sci-mem-1-1', question: 'Mitocôndria', correctAnswer: 'Fornecimento de energia', options: [] },
      { id: 'sci-mem-1-2', question: 'Núcleo', correctAnswer: 'Controle genético', options: [] },
      { id: 'sci-mem-1-3', question: 'Fotossíntese', correctAnswer: 'Produção de oxigênio', options: [] },
      { id: 'sci-mem-1-4', question: 'Planeta', correctAnswer: 'Órbita', options: [] },
    ],
  },
  {
    id: 'ciencias-dragdrop-1',
    subject: 'Ciências',
    type: 'dragdrop',
    title: 'Classificação de Animais',
    description: 'Classifique animais em seus grupos biológicos',
    difficulty: 'beginner',
    maxScore: 700,
    questions: [
      {
        items: ['Gato', 'Sapo', 'Cobra', 'Pinguim', 'Tubarão'],
        categories: {
          'Mamíferos': ['Gato'],
          'Anfíbios': ['Sapo'],
          'Répteis': ['Cobra'],
          'Aves': ['Pinguim'],
          'Peixes': ['Tubarão'],
        },
      },
    ],
  },
  {
    id: 'ciencias-speed-1',
    subject: 'Ciências',
    type: 'speedchallenge',
    title: 'Fatos Científicos Rápidos',
    description: 'Responda sobre fatos científicos o mais rápido possível',
    difficulty: 'intermediate',
    maxScore: 900,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Qual é o símbolo químico do ouro?', options: ['Au', 'Or', 'Go', 'Ao'], correctAnswer: 'Au' },
      { question: 'Qual gás respiramos?', options: ['Oxigênio', 'Nitrogênio', 'Hélio', 'Argônio'], correctAnswer: 'Oxigênio' },
      { question: 'Quantos planetas tem no sistema solar?', options: ['8', '9', '7', '10'], correctAnswer: '8' },
    ],
  },
  {
    id: 'ciencias-timeline-1',
    subject: 'Ciências',
    type: 'timeline',
    title: 'Evolução da Vida',
    description: 'Ordene os períodos geológicos em sequência',
    difficulty: 'advanced',
    maxScore: 800,
    questions: [
      {
        events: [
          { event: 'Surgimento de algas', order: 1 },
          { event: 'Era dos Dinossauros', order: 2 },
          { event: 'Surgimento de mamíferos', order: 3 },
        ],
      },
    ],
  },
  {
    id: 'ciencias-puzzle-1',
    subject: 'Ciências',
    type: 'puzzle',
    title: 'Ciclo Hidrológico',
    description: 'Monte o ciclo da água colocando os processos em ordem',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        items: ['Evaporação', 'Condensação', 'Precipitação', 'Infiltração'],
        correctAnswer: 'Evaporação → Condensação → Precipitação → Infiltração',
      },
    ],
  },

  // ========== ARTE (4 games) ==========
  {
    id: 'arte-memory-1',
    subject: 'Arte',
    type: 'memory',
    title: 'Artistas Famosos',
    description: 'Encontre pares de artistas e suas obras mais famosas',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'art-mem-1-1', question: 'Leonardo da Vinci', correctAnswer: 'Monalisa', options: [] },
      { id: 'art-mem-1-2', question: 'Pablo Picasso', correctAnswer: 'Guernica', options: [] },
      { id: 'art-mem-1-3', question: 'Vincent van Gogh', correctAnswer: 'Noite Estrelada', options: [] },
      { id: 'art-mem-1-4', question: 'Michelangelo', correctAnswer: 'David', options: [] },
    ],
  },
  {
    id: 'arte-dragdrop-1',
    subject: 'Arte',
    type: 'dragdrop',
    title: 'Períodos Artísticos',
    description: 'Classifique obras de arte em seus períodos históricos',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        items: ['Guernica', 'Noite Estrelada', 'David', 'Persistência da Memória'],
        categories: {
          'Renascença': ['David'],
          'Impressionismo': ['Noite Estrelada'],
          'Cubismo': ['Guernica'],
          'Surrealismo': ['Persistência da Memória'],
        },
      },
    ],
  },
  {
    id: 'arte-wordscramble-1',
    subject: 'Arte',
    type: 'wordscramble',
    title: 'Termos de Arte',
    description: 'Desembaralhe palavras relacionadas à arte',
    difficulty: 'beginner',
    maxScore: 600,
    questions: [
      { question: 'ARULCS', correctAnswer: 'ESCURA', hint: 'Período sem luz' },
      { question: 'LAPIÇ', correctAnswer: 'LÁPIS', hint: 'Instrumento de desenho' },
    ],
  },
  {
    id: 'arte-speed-1',
    subject: 'Arte',
    type: 'speedchallenge',
    title: 'Cores e Combinações',
    description: 'Identifique combinações de cores rápidamente',
    difficulty: 'beginner',
    maxScore: 700,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Azul + Amarelo = ?', options: ['Verde', 'Roxo', 'Laranja', 'Rosa'], correctAnswer: 'Verde' },
      { question: 'Vermelho + Azul = ?', options: ['Roxo', 'Verde', 'Laranja', 'Rosa'], correctAnswer: 'Roxo' },
    ],
  },

  // ========== EDUCAÇÃO FÍSICA (4 games) ==========
  {
    id: 'educfisica-memory-1',
    subject: 'Educação Física',
    type: 'memory',
    title: 'Esportes e Regras',
    description: 'Encontre pares de esportes e suas características',
    difficulty: 'beginner',
    maxScore: 800,
    questions: [
      { id: 'pe-mem-1-1', question: 'Futebol', correctAnswer: '11 jogadores por time', options: [] },
      { id: 'pe-mem-1-2', question: 'Basquete', correctAnswer: 'Cesta de 2 ou 3 pontos', options: [] },
      { id: 'pe-mem-1-3', question: 'Natação', correctAnswer: 'Água', options: [] },
      { id: 'pe-mem-1-4', question: 'Tênis', correctAnswer: 'Raquete', options: [] },
    ],
  },
  {
    id: 'educfisica-dragdrop-1',
    subject: 'Educação Física',
    type: 'dragdrop',
    title: 'Classificação de Esportes',
    description: 'Classifique esportes em suas categorias',
    difficulty: 'beginner',
    maxScore: 700,
    questions: [
      {
        items: ['Natação', 'Futebol', 'Tênis', 'Corrida'],
        categories: {
          'Aquáticos': ['Natação'],
          'Coletivos': ['Futebol'],
          'Individuais': ['Tênis', 'Corrida'],
        },
      },
    ],
  },
  {
    id: 'educfisica-speed-1',
    subject: 'Educação Física',
    type: 'speedchallenge',
    title: 'Conhecimentos Esportivos',
    description: 'Responda rápido sobre esportes',
    difficulty: 'intermediate',
    maxScore: 800,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Quantos sets tem um jogo de tênis?', options: ['Melhor de 3', 'Melhor de 5', 'Sempre 3', 'Sempre 2'], correctAnswer: 'Melhor de 3' },
      { question: 'Qual é o tamanho de uma quadra de basquete?', options: ['28 x 15m', '30 x 18m', '25 x 15m', '32 x 20m'], correctAnswer: '28 x 15m' },
    ],
  },
  {
    id: 'educfisica-timeline-1',
    subject: 'Educação Física',
    type: 'timeline',
    title: 'Olimpíadas Históricas',
    description: 'Ordene as olimpíadas em sequência cronológica',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        events: [
          { event: 'Olimpíadas Antigas Gregas', order: 1 },
          { event: 'Olimpíadas Rio 2016', order: 3 },
          { event: 'Olimpíadas Tóquio 2020', order: 4 },
          { event: 'Olimpíadas Modernas 1896', order: 2 },
        ],
      },
    ],
  },

  // ========== BIOLOGIA (4 games) ==========
  {
    id: 'biologia-memory-1',
    subject: 'Biologia',
    type: 'memory',
    title: 'Processo Biológico',
    description: 'Encontre pares de processos biológicos e suas descrições',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'bio-mem-1-1', question: 'Fotossíntese', correctAnswer: 'Produção de alimento via luz solar', options: [] },
      { id: 'bio-mem-1-2', question: 'Respiração', correctAnswer: 'Trocas gasosas para energia', options: [] },
      { id: 'bio-mem-1-3', question: 'Evolução', correctAnswer: 'Darwin', options: [] },
      { id: 'bio-mem-1-4', question: 'Ecossistema', correctAnswer: 'Biodiversidade', options: [] },
    ],
  },
  {
    id: 'biologia-speed-1',
    subject: 'Biologia',
    type: 'speedchallenge',
    title: 'Conceitos Biológicos Rápidos',
    description: 'Responda sobre conceitos de biologia o mais rápido possível',
    difficulty: 'intermediate',
    maxScore: 900,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Qual é a menor unidade da vida?', options: ['Célula', 'Molécula', 'Átomo', 'Gene'], correctAnswer: 'Célula' },
      { question: 'Qual processo plantas usam para fazer alimento?', options: ['Fotossíntese', 'Respiração', 'Digestão', 'Fermentação'], correctAnswer: 'Fotossíntese' },
    ],
  },
  {
    id: 'biologia-dragdrop-1',
    subject: 'Biologia',
    type: 'dragdrop',
    title: 'Reino dos Seres Vivos',
    description: 'Classifique seres vivos em seus reinos',
    difficulty: 'beginner',
    maxScore: 700,
    questions: [
      {
        items: ['Leão', 'Rosa', 'Fungo', 'Bactéria', 'Protozoário'],
        categories: {
          'Animalia': ['Leão'],
          'Plantae': ['Rosa'],
          'Fungi': ['Fungo'],
          'Monera': ['Bactéria'],
          'Protista': ['Protozoário'],
        },
      },
    ],
  },
  {
    id: 'biologia-timeline-1',
    subject: 'Biologia',
    type: 'timeline',
    title: 'Etapas da Vida',
    description: 'Ordene as etapas do desenvolvimento humano',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        events: [
          { event: 'Infância', order: 1 },
          { event: 'Adolescência', order: 2 },
          { event: 'Adultez', order: 3 },
          { event: 'Terceira Idade', order: 4 },
        ],
      },
    ],
  },

  // ========== QUÍMICA (4 games) ==========
  {
    id: 'quimica-memory-1',
    subject: 'Química',
    type: 'memory',
    title: 'Elementos Químicos',
    description: 'Encontre pares de elementos e seus símbolos',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'chem-mem-1-1', question: 'Ouro', correctAnswer: 'Au', options: [] },
      { id: 'chem-mem-1-2', question: 'Prata', correctAnswer: 'Ag', options: [] },
      { id: 'chem-mem-1-3', question: 'Carbono', correctAnswer: 'C', options: [] },
      { id: 'chem-mem-1-4', question: 'Hidrogênio', correctAnswer: 'H', options: [] },
    ],
  },
  {
    id: 'quimica-speed-1',
    subject: 'Química',
    type: 'speedchallenge',
    title: 'Símbolos Químicos',
    description: 'Identifique símbolos químicos rápidamente',
    difficulty: 'intermediate',
    maxScore: 900,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Qual é o símbolo do Hidrogênio?', options: ['H', 'He', 'Ho', 'Ha'], correctAnswer: 'H' },
      { question: 'Qual é o símbolo do Carbono?', options: ['C', 'Co', 'Ca', 'Cr'], correctAnswer: 'C' },
      { question: 'Qual é o símbolo do Nitrogênio?', options: ['N', 'Ni', 'Ne', 'Na'], correctAnswer: 'N' },
    ],
  },
  {
    id: 'quimica-dragdrop-1',
    subject: 'Química',
    type: 'dragdrop',
    title: 'Estados da Matéria',
    description: 'Classifique substâncias por seus estados físicos',
    difficulty: 'beginner',
    maxScore: 700,
    questions: [
      {
        items: ['Água líquida', 'Gelo', 'Vapor', 'Ar', 'Mercúrio'],
        categories: {
          'Sólido': ['Gelo', 'Mercúrio'],
          'Líquido': ['Água líquida'],
          'Gás': ['Vapor', 'Ar'],
        },
      },
    ],
  },
  {
    id: 'quimica-puzzle-1',
    subject: 'Química',
    type: 'puzzle',
    title: 'Fórmulas Químicas',
    description: 'Monte fórmulas químicas corretas',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        items: ['H', '2', 'O'],
        correctAnswer: 'H2O',
      },
      {
        items: ['C', 'O', '2'],
        correctAnswer: 'CO2',
      },
    ],
  },

  // ========== GEOGRAFIA (4 games) ==========
  {
    id: 'geografia-memory-1',
    subject: 'Geografia',
    type: 'memory',
    title: 'Capitais do Mundo',
    description: 'Encontre pares de países e suas capitais',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'geo-mem-1-1', question: 'Brasil', correctAnswer: 'Brasília', options: [] },
      { id: 'geo-mem-1-2', question: 'França', correctAnswer: 'Paris', options: [] },
      { id: 'geo-mem-1-3', question: 'Japão', correctAnswer: 'Tóquio', options: [] },
      { id: 'geo-mem-1-4', question: 'Egito', correctAnswer: 'Cairo', options: [] },
    ],
  },
  {
    id: 'geografia-dragdrop-1',
    subject: 'Geografia',
    type: 'dragdrop',
    title: 'Biomas Brasileiros',
    description: 'Classifique regiões por seus biomas',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        items: ['Amazonas', 'Pantanal', 'Caatinga', 'Cerrado'],
        categories: {
          'Floresta tropical': ['Amazonas'],
          'Savana': ['Cerrado'],
          'Semiárido': ['Caatinga'],
          'Alagado': ['Pantanal'],
        },
      },
    ],
  },
  {
    id: 'geografia-speed-1',
    subject: 'Geografia',
    type: 'speedchallenge',
    title: 'Conhecimentos Geográficos',
    description: 'Responda sobre geografia rápidamente',
    difficulty: 'intermediate',
    maxScore: 850,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Qual é o maior rio do Brasil?', options: ['Amazonas', 'São Francisco', 'Paraná', 'Negro'], correctAnswer: 'Amazonas' },
      { question: 'Qual é o maior deserto?', options: ['Saara', 'Kalahari', 'Gobi', 'Atacama'], correctAnswer: 'Saara' },
    ],
  },
  {
    id: 'geografia-timeline-1',
    subject: 'Geografia',
    type: 'timeline',
    title: 'Evolução Geográfica',
    description: 'Ordene eventos geográficos históricos',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        events: [
          { event: 'Descobrimento de novas rotas marítimas', order: 1 },
          { event: 'Era Industrial', order: 2 },
          { event: 'Globalização', order: 3 },
        ],
      },
    ],
  },

  // ========== SOCIOLOGIA (4 games) ==========
  {
    id: 'sociologia-memory-1',
    subject: 'Sociologia',
    type: 'memory',
    title: 'Conceitos Sociais',
    description: 'Encontre pares de conceitos e suas definições',
    difficulty: 'intermediate',
    maxScore: 800,
    questions: [
      { id: 'soc-mem-1-1', question: 'Sociedade', correctAnswer: 'Grupo de indivíduos vivendo juntos', options: [] },
      { id: 'soc-mem-1-2', question: 'Cultura', correctAnswer: 'Valores, crenças e práticas', options: [] },
      { id: 'soc-mem-1-3', question: 'Classe Social', correctAnswer: 'Posição na hierarquia social', options: [] },
      { id: 'soc-mem-1-4', question: 'Identidade', correctAnswer: 'Características que nos definem', options: [] },
    ],
  },
  {
    id: 'sociologia-speed-1',
    subject: 'Sociologia',
    type: 'speedchallenge',
    title: 'Questões Sociais',
    description: 'Responda sobre questões sociais rapidamente',
    difficulty: 'intermediate',
    maxScore: 850,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Qual é um dos pilares da sociedade?', options: ['Família', 'Diversão', 'Viagem', 'Comida'], correctAnswer: 'Família' },
      { question: 'Como se chama um grupo de pessoas?', options: ['Comunidade', 'Rebanho', 'Cardume', 'Nuvem'], correctAnswer: 'Comunidade' },
    ],
  },
  {
    id: 'sociologia-dragdrop-1',
    subject: 'Sociologia',
    type: 'dragdrop',
    title: 'Tipos de Sociedade',
    description: 'Classifique características em tipos de sociedade',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        items: ['Monarquia', 'Democracia', 'Ditadura', 'República'],
        categories: {
          'Formas de Governo Autoritárias': ['Monarquia', 'Ditadura'],
          'Formas de Governo Democráticas': ['Democracia', 'República'],
        },
      },
    ],
  },
  {
    id: 'sociologia-timeline-1',
    subject: 'Sociologia',
    type: 'timeline',
    title: 'Evolução dos Direitos',
    description: 'Ordene marcos na história dos direitos humanos',
    difficulty: 'intermediate',
    maxScore: 700,
    questions: [
      {
        events: [
          { event: 'Abolição da Escravidão', order: 1 },
          { event: 'Direitos das Mulheres', order: 2 },
          { event: 'Igualdade Racial', order: 3 },
        ],
      },
    ],
  },

  // ========== FILOSOFIA (3 games) ==========
  {
    id: 'filosofia-speed-1',
    subject: 'Filosofia',
    type: 'speedchallenge',
    title: 'Pensadores Rápidos',
    description: 'Responda sobre filósofos e suas ideias rapidamente',
    difficulty: 'advanced',
    maxScore: 900,
    timeLimit: 60,
    streakBonus: true,
    speedBonus: true,
    questions: [
      { question: 'Quem criou a teoria das Formas?', options: ['Platão', 'Aristóteles', 'Sócrates', 'Kant'], correctAnswer: 'Platão' },
      { question: 'O que significa "Cogito, ergo sum"?', options: ['Penso, logo existo', 'Vejo, logo existo', 'Sinto, logo existo', 'Sei, logo existo'], correctAnswer: 'Penso, logo existo' },
    ],
  },
  {
    id: 'filosofia-memory-1',
    subject: 'Filosofia',
    type: 'memory',
    title: 'Filósofos e Ideias',
    description: 'Encontre pares de filósofos e suas contribuições',
    difficulty: 'advanced',
    maxScore: 800,
    questions: [
      { id: 'phil-mem-1-1', question: 'Kant', correctAnswer: 'Crítica da Razão Pura', options: [] },
      { id: 'phil-mem-1-2', question: 'Nietzsche', correctAnswer: 'Além do bem e do mal', options: [] },
      { id: 'phil-mem-1-3', question: 'Platão', correctAnswer: 'Teoria das Ideias', options: [] },
      { id: 'phil-mem-1-4', question: 'Descartes', correctAnswer: 'Penso, logo existo', options: [] },
    ],
  },
  {
    id: 'filosofia-timeline-1',
    subject: 'Filosofia',
    type: 'timeline',
    title: 'Períodos Filosóficos',
    description: 'Ordene os períodos da filosofia em sequência',
    difficulty: 'advanced',
    maxScore: 700,
    questions: [
      {
        events: [
          { event: 'Filosofia Antiga', order: 1 },
          { event: 'Filosofia Medieval', order: 2 },
          { event: 'Filosofia Moderna', order: 3 },
          { event: 'Filosofia Contemporânea', order: 4 },
        ],
      },
    ],
  },

  // ===== MATEMATICA – Quiz / TrueFalse / FillBlank =====
  {
    id: 'math-quiz-1',
    subject: 'Matematica',
    type: 'quiz',
    title: 'Quiz: Matematica Basica',
    description: 'Teste seus conhecimentos de matematica com perguntas variadas',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    streakBonus: true,
    questions: [
      { question: 'Qual o resultado de 8 x 9?', options: ['63', '72', '81', '64'], correctAnswer: '72' },
      { question: 'Qual a raiz quadrada de 144?', options: ['10', '12', '14', '16'], correctAnswer: '12' },
      { question: 'Triangulo com lados 3, 4 e 5 e...', options: ['Equilatero', 'Isosceles', 'Retangulo', 'Obtusangulo'], correctAnswer: 'Retangulo' },
      { question: 'Quantos lados tem um hexagono?', options: ['5', '6', '7', '8'], correctAnswer: '6' },
      { question: 'O valor de pi aproximado e...', options: ['2,71', '3,14', '1,41', '1,73'], correctAnswer: '3,14' },
      { question: '25% de 200 e...', options: ['25', '40', '50', '75'], correctAnswer: '50' },
    ],
  },
  {
    id: 'math-truefalse-1',
    subject: 'Matematica',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Numeros',
    description: 'Avalie se as afirmacoes matematicas sao verdadeiras ou falsas',
    difficulty: 'beginner',
    maxScore: 400,
    timeLimit: 60,
    questions: [
      { question: 'O numero 0 e par.', correctAnswer: 'true' },
      { question: 'Todo quadrado e um retangulo.', correctAnswer: 'true' },
      { question: '1 e um numero primo.', correctAnswer: 'false' },
      { question: 'A soma dos angulos internos de um triangulo e 180 graus.', correctAnswer: 'true' },
      { question: 'A raiz quadrada de 2 e um numero racional.', correctAnswer: 'false' },
      { question: 'Um numero divisivel por 6 tambem e divisivel por 3.', correctAnswer: 'true' },
    ],
  },
  {
    id: 'math-fillblank-1',
    subject: 'Matematica',
    type: 'fillblank',
    title: 'Preencha: Formulas Matematicas',
    description: 'Complete as formulas e equacoes matematicas',
    difficulty: 'intermediate',
    maxScore: 600,
    questions: [
      { question: 'A area de um circulo e A = _____ x r ao quadrado', correctAnswer: 'pi' },
      { question: 'Teorema de Pitagoras: a2 + b2 = _____', correctAnswer: 'c2' },
      { question: 'Formula de Bhaskara: x = (-b mais ou menos raiz(b2-4ac)) / _____', correctAnswer: '2a' },
    ],
  },

  // ===== PORTUGUES – Quiz / TrueFalse / FillBlank =====
  {
    id: 'port-quiz-1',
    subject: 'Portugues',
    type: 'quiz',
    title: 'Quiz: Gramatica e Literatura',
    description: 'Teste seus conhecimentos de lingua portuguesa',
    difficulty: 'intermediate',
    maxScore: 500,
    timeLimit: 90,
    streakBonus: true,
    questions: [
      { question: 'Qual a classe gramatical de "rapidamente"?', options: ['Adjetivo', 'Adverbio', 'Substantivo', 'Verbo'], correctAnswer: 'Adverbio' },
      { question: 'Quem escreveu Dom Casmurro?', options: ['Jose de Alencar', 'Machado de Assis', 'Clarice Lispector', 'Guimaraes Rosa'], correctAnswer: 'Machado de Assis' },
      { question: 'Qual figura de linguagem em "O ceu chorava"?', options: ['Metonimia', 'Personificacao', 'Hiperbole', 'Metafora'], correctAnswer: 'Personificacao' },
      { question: 'Plural correto de cidadao:', options: ['cidadoes', 'cidadaos', 'cidadais', 'cidadois'], correctAnswer: 'cidadaos' },
      { question: 'O Realismo brasileiro iniciou em...', options: ['1822', '1836', '1881', '1922'], correctAnswer: '1881' },
    ],
  },
  {
    id: 'port-truefalse-1',
    subject: 'Portugues',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Gramatica',
    description: 'Verifique o uso correto da lingua portuguesa',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'A palavra farmacia tem acento correto.', correctAnswer: 'true' },
      { question: 'Ter e haver tem o mesmo significado em todos os contextos.', correctAnswer: 'false' },
      { question: 'Mal e mau sao de classes gramaticais diferentes.', correctAnswer: 'true' },
      { question: 'Pronomes obliquos podem ser sujeito da oracao.', correctAnswer: 'false' },
      { question: 'Virgula deve preceder a conjuncao "e" sempre.', correctAnswer: 'false' },
    ],
  },

  // ===== ENGLISH – Quiz / TrueFalse / FillBlank =====
  {
    id: 'eng-quiz-1',
    subject: 'English',
    type: 'quiz',
    title: 'Quiz: English Grammar',
    description: 'Test your English grammar and vocabulary knowledge',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    streakBonus: true,
    questions: [
      { question: 'Which is correct: "I ____ to school every day."', options: ['go', 'goes', 'going', 'went'], correctAnswer: 'go' },
      { question: 'Past tense of "eat" is:', options: ['eated', 'ate', 'eaten', 'ets'], correctAnswer: 'ate' },
      { question: 'Correct article: "____ umbrella"', options: ['a', 'an', 'the', 'no article'], correctAnswer: 'an' },
      { question: 'Correct sentence:', options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."], correctAnswer: "She doesn't like coffee." },
      { question: 'What does gorgeous mean?', options: ['horrible', 'extremely beautiful', 'angry', 'tired'], correctAnswer: 'extremely beautiful' },
      { question: 'Plural of child:', options: ['childs', 'childes', 'children', 'childrens'], correctAnswer: 'children' },
    ],
  },
  {
    id: 'eng-truefalse-1',
    subject: 'English',
    type: 'truefalse',
    title: 'True or False: English Rules',
    description: 'Decide if these English statements are true or false',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: '"Much" is used with countable nouns.', correctAnswer: 'false' },
      { question: 'Present Perfect uses have/has + past participle.', correctAnswer: 'true' },
      { question: '"Advice" has a plural form "advices".', correctAnswer: 'false' },
      { question: 'In English, adjectives go before the noun.', correctAnswer: 'true' },
      { question: '"Since" is used for a duration like "since 3 hours".', correctAnswer: 'false' },
    ],
  },
  {
    id: 'eng-fillblank-1',
    subject: 'English',
    type: 'fillblank',
    title: 'Fill in the Blank: Prepositions',
    description: 'Complete sentences with the correct prepositions',
    difficulty: 'intermediate',
    maxScore: 500,
    questions: [
      { question: "I'm interested _____ learning English.", correctAnswer: 'in' },
      { question: "She's been here _____ Monday.", correctAnswer: 'since' },
      { question: 'We arrived _____ the airport at 6pm.', correctAnswer: 'at' },
      { question: 'He is afraid _____ spiders.', correctAnswer: 'of' },
    ],
  },

  // ===== HISTORIA – Quiz / TrueFalse =====
  {
    id: 'hist-quiz-1',
    subject: 'Historia',
    type: 'quiz',
    title: 'Quiz: Grandes Eventos Historicos',
    description: 'Teste seus conhecimentos sobre eventos historicos marcantes',
    difficulty: 'intermediate',
    maxScore: 500,
    timeLimit: 90,
    streakBonus: true,
    questions: [
      { question: 'Em que ano foi proclamada a Independencia do Brasil?', options: ['1808', '1815', '1822', '1889'], correctAnswer: '1822' },
      { question: 'A Revolucao Francesa comecou em:', options: ['1776', '1789', '1804', '1815'], correctAnswer: '1789' },
      { question: 'Lider da Inconfidencia Mineira:', options: ['D. Joao VI', 'Tiradentes', 'Jose Bonifacio', 'Caxias'], correctAnswer: 'Tiradentes' },
      { question: 'A abolicao da escravatura no Brasil ocorreu em:', options: ['1850', '1871', '1888', '1889'], correctAnswer: '1888' },
      { question: 'Quem construiu as piramides de Gize?', options: ['Mesopotamia', 'Grecia Antiga', 'Roma', 'Egito Antigo'], correctAnswer: 'Egito Antigo' },
    ],
  },
  {
    id: 'hist-truefalse-1',
    subject: 'Historia',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Historia do Brasil',
    description: 'Avalie afirmacoes sobre a historia brasileira',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'D. Pedro I proclamou a Independencia em 7 de setembro de 1822.', correctAnswer: 'true' },
      { question: 'O Brasil foi colonia da Espanha.', correctAnswer: 'false' },
      { question: 'A Republica foi proclamada em 1889.', correctAnswer: 'true' },
      { question: 'Getulio Vargas governou o Brasil apenas uma vez.', correctAnswer: 'false' },
      { question: 'A capital do Brasil sempre foi Brasilia.', correctAnswer: 'false' },
    ],
  },

  // ===== CIENCIAS – Quiz / TrueFalse / FillBlank =====
  {
    id: 'sci-quiz-1',
    subject: 'Ciencias',
    type: 'quiz',
    title: 'Quiz: Ciencias Naturais',
    description: 'Teste seus conhecimentos sobre ciencias e o mundo natural',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    streakBonus: true,
    questions: [
      { question: 'Qual organela e responsavel pela fotossintese?', options: ['Mitocondria', 'Ribossomo', 'Cloroplasto', 'Vacuolo'], correctAnswer: 'Cloroplasto' },
      { question: 'Qual o simbolo quimico do ouro?', options: ['Or', 'Go', 'Au', 'Ag'], correctAnswer: 'Au' },
      { question: 'A velocidade da luz no vacuo e aproximadamente:', options: ['300 km/s', '300.000 km/s', '30.000 km/s', '3.000.000 km/s'], correctAnswer: '300.000 km/s' },
      { question: 'Qual gas e essencial para a respiracao humana?', options: ['CO2', 'N2', 'O2', 'H2'], correctAnswer: 'O2' },
      { question: 'DNA significa:', options: ['Acido Desoxirribonucleico', 'Acido Nucleico Duplo', 'Dinucleotideo Ativo', 'Doador Nuclear Ativo'], correctAnswer: 'Acido Desoxirribonucleico' },
    ],
  },
  {
    id: 'sci-truefalse-1',
    subject: 'Ciencias',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Ciencias',
    description: 'Avalie se as afirmacoes cientificas sao corretas',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'Os seres humanos tem 46 cromossomos.', correctAnswer: 'true' },
      { question: 'A Lua e uma estrela.', correctAnswer: 'false' },
      { question: 'A agua ferve a 100 graus Celsius ao nivel do mar.', correctAnswer: 'true' },
      { question: 'Os virus sao seres vivos com celulas proprias.', correctAnswer: 'false' },
      { question: 'O coracao humano tem quatro camaras.', correctAnswer: 'true' },
    ],
  },
  {
    id: 'sci-fillblank-1',
    subject: 'Ciencias',
    type: 'fillblank',
    title: 'Preencha: Conceitos Cientificos',
    description: 'Complete as definicoes e formulas cientificas',
    difficulty: 'intermediate',
    maxScore: 500,
    questions: [
      { question: 'A formula quimica da agua e _____', correctAnswer: 'H2O' },
      { question: 'Segunda Lei de Newton: F = m x _____', correctAnswer: 'a' },
      { question: 'A fotossintese produz glicose e _____', correctAnswer: 'oxigenio' },
    ],
  },

  // ===== GEOGRAFIA – Quiz / TrueFalse =====
  {
    id: 'geo-quiz-1',
    subject: 'Geografia',
    type: 'quiz',
    title: 'Quiz: Mundo e Brasil',
    description: 'Teste seus conhecimentos geograficos',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    streakBonus: true,
    questions: [
      { question: 'Qual o maior rio do mundo em volume de agua?', options: ['Nilo', 'Amazonas', 'Yangtze', 'Mississippi'], correctAnswer: 'Amazonas' },
      { question: 'Qual a capital do Brasil?', options: ['Sao Paulo', 'Rio de Janeiro', 'Salvador', 'Brasilia'], correctAnswer: 'Brasilia' },
      { question: 'Quantos continentes existem na Terra?', options: ['5', '6', '7', '8'], correctAnswer: '7' },
      { question: 'O deserto do Saara fica em qual continente?', options: ['Asia', 'America', 'Africa', 'Oceania'], correctAnswer: 'Africa' },
      { question: 'Brasil faz fronteira com todos, exceto:', options: ['Argentina', 'Bolivia', 'Chile', 'Uruguai'], correctAnswer: 'Chile' },
    ],
  },
  {
    id: 'geo-truefalse-1',
    subject: 'Geografia',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Geografia',
    description: 'Avalie afirmacoes sobre o planeta e o Brasil',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'O Brasil esta localizado inteiramente no hemisferio sul.', correctAnswer: 'false' },
      { question: 'O Rio Amazonas deságua no Oceano Atlantico.', correctAnswer: 'true' },
      { question: 'Tokyo e a cidade mais populosa do mundo.', correctAnswer: 'true' },
      { question: 'A Australia e ao mesmo tempo um pais e um continente.', correctAnswer: 'true' },
    ],
  },

  // ===== EDUCACAO FISICA – Quiz / TrueFalse =====
  {
    id: 'edf-quiz-1',
    subject: 'Educacao Fisica',
    type: 'quiz',
    title: 'Quiz: Esportes e Saude',
    description: 'Teste seus conhecimentos sobre esportes, regras e saude',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    questions: [
      { question: 'Quantos jogadores tem um time de futebol em campo?', options: ['9', '10', '11', '12'], correctAnswer: '11' },
      { question: 'Qual esporte usa rede de 2,43m de altura?', options: ['Tenis', 'Volei masculino', 'Badminton', 'Basquete'], correctAnswer: 'Volei masculino' },
      { question: 'Frequencia cardiaca maxima estimada: _____ menos a idade', options: ['180', '200', '220', '240'], correctAnswer: '220' },
      { question: 'Quantas calorias tem 1g de proteina?', options: ['4', '7', '9', '12'], correctAnswer: '4' },
      { question: 'Qual vitamina e sintetizada pelo sol?', options: ['Vitamina A', 'Vitamina B12', 'Vitamina C', 'Vitamina D'], correctAnswer: 'Vitamina D' },
    ],
  },
  {
    id: 'edf-truefalse-1',
    subject: 'Educacao Fisica',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Saude e Esporte',
    description: 'Avalie afirmacoes sobre saude, corpo e esportes',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'O corpo humano adulto tem 206 ossos.', correctAnswer: 'true' },
      { question: 'Correr e um exercicio anaerobico.', correctAnswer: 'false' },
      { question: 'OMS recomenda 150 minutos de atividade fisica por semana.', correctAnswer: 'true' },
      { question: 'Beber agua durante o exercicio prejudica o desempenho.', correctAnswer: 'false' },
    ],
  },

  // ===== ARTE – Quiz / TrueFalse =====
  {
    id: 'art-quiz-1',
    subject: 'Arte',
    type: 'quiz',
    title: 'Quiz: Historia da Arte',
    description: 'Teste seus conhecimentos sobre arte e artistas',
    difficulty: 'intermediate',
    maxScore: 500,
    timeLimit: 90,
    questions: [
      { question: 'Quem pintou a Ultima Ceia?', options: ['Rafael', 'Michelangelo', 'Leonardo da Vinci', 'Caravaggio'], correctAnswer: 'Leonardo da Vinci' },
      { question: 'O movimento que explorou sonhos e o inconsciente foi o...', options: ['Impressionismo', 'Cubismo', 'Surrealismo', 'Expressionismo'], correctAnswer: 'Surrealismo' },
      { question: 'Quem criou A Guernica?', options: ['Salvador Dali', 'Pablo Picasso', 'Henri Matisse', 'Giorgio de Chirico'], correctAnswer: 'Pablo Picasso' },
      { question: 'O Pensador e uma escultura de...', options: ['Bernini', 'Rodin', 'Michelangelo', 'Brancusi'], correctAnswer: 'Rodin' },
      { question: 'O Impressionismo surgiu em qual pais?', options: ['Italia', 'Alemanha', 'Franca', 'Espanha'], correctAnswer: 'Franca' },
    ],
  },
  {
    id: 'art-truefalse-1',
    subject: 'Arte',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Arte Brasileira',
    description: 'Avalie fatos sobre arte e cultura brasileira',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'Tarsila do Amaral pintou Abaporu.', correctAnswer: 'true' },
      { question: 'O Modernismo brasileiro comecou com a Semana de Arte Moderna de 1922.', correctAnswer: 'true' },
      { question: 'O Barroco e um movimento artistico do seculo XX.', correctAnswer: 'false' },
    ],
  },

  // ===== MUSICA – Quiz / TrueFalse =====
  {
    id: 'mus-quiz-1',
    subject: 'Musica',
    type: 'quiz',
    title: 'Quiz: Teoria e Historia Musical',
    description: 'Teste seus conhecimentos sobre musica',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    questions: [
      { question: 'Quantas notas na escala diatonica?', options: ['5', '7', '8', '12'], correctAnswer: '7' },
      { question: 'Qual instrumento tem 88 teclas?', options: ['Acordeao', 'Orgao', 'Piano', 'Cravo'], correctAnswer: 'Piano' },
      { question: 'Qual foi a ultima sinfonia de Beethoven?', options: ['7a', '8a', '9a', '10a'], correctAnswer: '9a' },
      { question: 'O samba e originario de qual pais?', options: ['Angola', 'Cuba', 'Brasil', 'Portugal'], correctAnswer: 'Brasil' },
      { question: 'Qual signo musical indica silencio?', options: ['Clave', 'Pausa', 'Fermata', 'Ligadura'], correctAnswer: 'Pausa' },
    ],
  },

  // ===== FILOSOFIA – Quiz / TrueFalse =====
  {
    id: 'fil-quiz-1',
    subject: 'Filosofia',
    type: 'quiz',
    title: 'Quiz: Grandes Filosofos',
    description: 'Teste seus conhecimentos sobre filosofia e pensadores',
    difficulty: 'intermediate',
    maxScore: 500,
    timeLimit: 90,
    questions: [
      { question: '"Penso, logo existo" e uma frase de...', options: ['Kant', 'Descartes', 'Nietzsche', 'Platao'], correctAnswer: 'Descartes' },
      { question: 'Qual filosofo escreveu A Republica?', options: ['Socrates', 'Aristoteles', 'Platao', 'Epicuro'], correctAnswer: 'Platao' },
      { question: 'O que estuda a Etica?', options: ['A beleza', 'O conhecimento', 'O comportamento moral', 'A logica'], correctAnswer: 'O comportamento moral' },
      { question: '"Deus esta morto" foi dito por...', options: ['Schopenhauer', 'Hegel', 'Nietzsche', 'Sartre'], correctAnswer: 'Nietzsche' },
    ],
  },
  {
    id: 'fil-truefalse-1',
    subject: 'Filosofia',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Filosofia',
    description: 'Avalie afirmacoes filosoficas',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'Socrates escreveu sua filosofia em livros.', correctAnswer: 'false' },
      { question: 'O Empirismo defende que o conhecimento vem da experiencia sensorial.', correctAnswer: 'true' },
      { question: 'Marx e Engels escreveram o Manifesto Comunista.', correctAnswer: 'true' },
    ],
  },

  // ===== RELIGIAO/ETICA – Quiz =====
  {
    id: 'rel-quiz-1',
    subject: 'Religiao/Etica',
    type: 'quiz',
    title: 'Quiz: Etica e Valores',
    description: 'Teste seus conhecimentos sobre etica, valores e religioes',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    questions: [
      { question: 'A regra de ouro aparece em...', options: ['Apenas o Cristianismo', 'Apenas o Isla', 'Diversas religioes e culturas', 'Apenas o Budismo'], correctAnswer: 'Diversas religioes e culturas' },
      { question: 'Qual o livro sagrado do Islamismo?', options: ['Biblia', 'Tora', 'Alcorao', 'Vedas'], correctAnswer: 'Alcorao' },
      { question: 'Etica estuda...', options: ['Leis juridicas', 'Comportamento moral e valores', 'Tradicoes religiosas', 'Costumes culturais'], correctAnswer: 'Comportamento moral e valores' },
      { question: 'Qual filosofo criou o Imperativo Categorico?', options: ['Platao', 'Socrates', 'Kant', 'Aristoteles'], correctAnswer: 'Kant' },
    ],
  },

  // ===== INFORMATICA – Quiz / TrueFalse / FillBlank =====
  {
    id: 'info-quiz-1',
    subject: 'Informatica',
    type: 'quiz',
    title: 'Quiz: Tecnologia e Programacao',
    description: 'Teste seus conhecimentos sobre computacao e tecnologia',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    streakBonus: true,
    questions: [
      { question: 'O que significa HTML?', options: ['High Tech Markup Language', 'HyperText Markup Language', 'Hyperlink Text Markup Language', 'Home Tool Markup Language'], correctAnswer: 'HyperText Markup Language' },
      { question: 'Qual estrutura e "primeiro a entrar, primeiro a sair"?', options: ['Pilha', 'Fila', 'Arvore', 'Grafo'], correctAnswer: 'Fila' },
      { question: 'O resultado de 2 elevado a 8 e:', options: ['128', '256', '512', '64'], correctAnswer: '256' },
      { question: 'CPU significa:', options: ['Central Processing Unit', 'Computer Power Unit', 'Core Processing Utility', 'Central Program Unit'], correctAnswer: 'Central Processing Unit' },
      { question: 'Qual linguagem estiliza paginas web?', options: ['JavaScript', 'HTML', 'CSS', 'Python'], correctAnswer: 'CSS' },
    ],
  },
  {
    id: 'info-truefalse-1',
    subject: 'Informatica',
    type: 'truefalse',
    title: 'Verdadeiro ou Falso: Computacao',
    description: 'Avalie afirmacoes sobre tecnologia e computacao',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'Um byte e composto por 8 bits.', correctAnswer: 'true' },
      { question: 'Python e uma linguagem compilada.', correctAnswer: 'false' },
      { question: 'RAM e um tipo de memoria volatil.', correctAnswer: 'true' },
      { question: 'O sistema binario usa os digitos 0, 1 e 2.', correctAnswer: 'false' },
    ],
  },
  {
    id: 'info-fillblank-1',
    subject: 'Informatica',
    type: 'fillblank',
    title: 'Preencha: Programacao',
    description: 'Complete os conceitos de programacao',
    difficulty: 'intermediate',
    maxScore: 500,
    questions: [
      { question: 'O loop que executa enquanto a condicao e verdadeira chama-se _____', correctAnswer: 'while' },
      { question: 'Em JavaScript, para declarar variavel imutavel usa-se _____', correctAnswer: 'const' },
    ],
  },

  // ===== ESPANHOL – Quiz / FillBlank =====
  {
    id: 'esp-quiz-1',
    subject: 'Espanhol',
    type: 'quiz',
    title: 'Quiz: Espanol Basico',
    description: 'Teste tus conocimientos de espanol',
    difficulty: 'beginner',
    maxScore: 500,
    timeLimit: 90,
    questions: [
      { question: 'Como se dice obrigado en espanol?', options: ['Por favor', 'Gracias', 'De nada', 'Hola'], correctAnswer: 'Gracias' },
      { question: 'Articulo correto: "_____ libro"', options: ['la', 'las', 'los', 'el'], correctAnswer: 'el' },
      { question: '"Yo _____ estudiante" – verbo correto:', options: ['soy', 'estoy', 'tengo', 'hay'], correctAnswer: 'soy' },
      { question: 'Que significa mariposa?', options: ['borboleta', 'formiga', 'abelha', 'libelula'], correctAnswer: 'borboleta' },
      { question: 'Plural de el nino e...', options: ['los nino', 'las ninos', 'los ninos', 'el ninos'], correctAnswer: 'los ninos' },
    ],
  },
  {
    id: 'esp-fillblank-1',
    subject: 'Espanhol',
    type: 'fillblank',
    title: 'Completa: Verbos en Espanol',
    description: 'Completa las oraciones con el verbo correcto',
    difficulty: 'beginner',
    maxScore: 400,
    questions: [
      { question: 'Ella _____ (hablar) muy rapido.', correctAnswer: 'habla' },
      { question: 'Tu _____ (querer) ir al cine?', correctAnswer: 'quieres' },
    ],
  },
];

export const SUBJECT_MAPPING: Record<string, string> = {
  // Matemática
  'math': 'Matemática',
  'matematica': 'Matemática',
  'Matematica': 'Matemática',
  'Matemática': 'Matemática',
  // Português
  'portugues': 'Português',
  'portuguese': 'Português',
  'Portugues': 'Português',
  'Português': 'Português',
  // English / Inglês
  'english': 'English',
  'ingles': 'English',
  'inglês': 'English',
  'English': 'English',
  // História
  'historia': 'História',
  'history': 'História',
  'Historia': 'História',
  'História': 'História',
  // Ciências
  'ciencias': 'Ciências',
  'science': 'Ciências',
  'Ciencias': 'Ciências',
  'Ciências': 'Ciências',
  // Geografia
  'geografia': 'Geografia',
  'geography': 'Geografia',
  'Geografia': 'Geografia',
  // Educação Física
  'educacao-fisica': 'Educação Física',
  'educacao fisica': 'Educação Física',
  'physical-ed': 'Educação Física',
  'Educacao Fisica': 'Educação Física',
  'Educação Física': 'Educação Física',
  // Arte
  'arte': 'Arte',
  'art': 'Arte',
  'Arte': 'Arte',
  // Música
  'musica': 'Música',
  'music': 'Música',
  'Musica': 'Música',
  'Música': 'Música',
  // Filosofia
  'filosofia': 'Filosofia',
  'philosophy': 'Filosofia',
  'Filosofia': 'Filosofia',
  // Religião/Ética
  'religiao': 'Religião/Ética',
  'religiao/etica': 'Religião/Ética',
  'ethics': 'Religião/Ética',
  'Religiao/Etica': 'Religião/Ética',
  'Religião/Ética': 'Religião/Ética',
  // Informática
  'informatica': 'Informática',
  'computer-science': 'Informática',
  'Informatica': 'Informática',
  'Informática': 'Informática',
  // Espanhol
  'espanhol': 'Espanhol',
  'spanish': 'Espanhol',
  'Espanhol': 'Espanhol',
  // Biologia
  'biologia': 'Biologia',
  'biology': 'Biologia',
  'Biologia': 'Biologia',
  // Química
  'quimica': 'Química',
  'chemistry': 'Química',
  'Quimica': 'Química',
  'Química': 'Química',
  // Sociologia
  'sociologia': 'Sociologia',
  'sociology': 'Sociologia',
  'Sociologia': 'Sociologia',
};

// Strips accents/diacritics and lowercases for fuzzy subject matching
function normalizeSubject(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]/g, '');      // keep only alphanumeric
}

// Map of canonical subject IDs → all possible name variants (accented + unaccented)
const SUBJECT_ID_MAP: Record<string, string[]> = {
  'math':            ['Matemática', 'Matematica'],
  'portuguese':      ['Português', 'Portugues'],
  'english':         ['English', 'Inglês', 'Ingles'],
  'history':         ['História', 'Historia'],
  'science':         ['Ciências', 'Ciencias'],
  'geography':       ['Geografia'],
  'physical-ed':     ['Educação Física', 'Educacao Fisica'],
  'art':             ['Arte'],
  'music':           ['Música', 'Musica'],
  'philosophy':      ['Filosofia'],
  'ethics':          ['Religião/Ética', 'Religiao/Etica'],
  'computer-science':['Informática', 'Informatica'],
  'spanish':         ['Espanhol'],
  'biology':         ['Biologia'],
  'chemistry':       ['Química', 'Quimica'],
  'sociology':       ['Sociologia'],
};

export function getMiniGamesBySubject(subject: string): MiniGameData[] {
  const normInput = normalizeSubject(subject);

  // 1. Try matching via canonical map keys
  for (const [, variants] of Object.entries(SUBJECT_ID_MAP)) {
    if (variants.some(v => normalizeSubject(v) === normInput)) {
      // Return all games whose subject normalizes to any variant in this group
      const normVariants = variants.map(normalizeSubject);
      return MINIGAMES_DB.filter(game => normVariants.includes(normalizeSubject(game.subject)));
    }
  }

  // 2. Fallback: check map keys (e.g. 'math', 'history')
  const byKey = SUBJECT_ID_MAP[subject.toLowerCase()];
  if (byKey) {
    const normVariants = byKey.map(normalizeSubject);
    return MINIGAMES_DB.filter(game => normVariants.includes(normalizeSubject(game.subject)));
  }

  // 3. Last resort: partial fuzzy match
  return MINIGAMES_DB.filter(game =>
    normalizeSubject(game.subject).includes(normInput) ||
    normInput.includes(normalizeSubject(game.subject))
  );
}

export function getMiniGameById(id: string): MiniGameData | undefined {
  return MINIGAMES_DB.find(game => game.id === id);
}

export function getAllSubjects(): string[] {
  const subjects = new Set(MINIGAMES_DB.map(game => game.subject));
  return Array.from(subjects).sort();
}

export function getGameStatistics() {
  const stats = {
    total: MINIGAMES_DB.length,
    bySubject: {} as Record<string, number>,
    byType: {} as Record<string, number>,
  };

  MINIGAMES_DB.forEach(game => {
    stats.bySubject[game.subject] = (stats.bySubject[game.subject] || 0) + 1;
    stats.byType[game.type] = (stats.byType[game.type] || 0) + 1;
  });

  return stats;
}