// Mini-games database with 65+ games across 13 subjects
// Estrategicamente distribuídos com diferentes tipos de jogos para máximo engajamento

export interface MiniGameData {
  id: string;
  subject: string;
  type: 'dragdrop' | 'wordscramble' | 'memory' | 'timeline' | 'speedchallenge' | 'puzzle';
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
];

export const SUBJECT_MAPPING: Record<string, string> = {
  'math': 'Matemática',
  'matemática': 'Matemática',
  'português': 'Português',
  'portuguese': 'Português',
  'portugu': 'Português',
  'english': 'English',
  'inglês': 'English',
  'ingles': 'English',
  'história': 'História',
  'history': 'História',
  'ciências': 'Ciências',
  'ciencia': 'Ciências',
  'science': 'Ciências',
  'arte': 'Arte',
  'art': 'Arte',
  'educação física': 'Educação Física',
  'educacao fisica': 'Educação Física',
  'physical education': 'Educação Física',
  'pe': 'Educação Física',
  'biologia': 'Biologia',
  'biology': 'Biologia',
  'química': 'Química',
  'quimica': 'Química',
  'chemistry': 'Química',
  'geografia': 'Geografia',
  'geography': 'Geografia',
  'sociologia': 'Sociologia',
  'sociology': 'Sociologia',
  'filosofia': 'Filosofia',
  'philosophy': 'Filosofia',
};

export function getMiniGamesBySubject(subject: string): MiniGameData[] {
  if (!subject) return [];
  
  // Normalize input
  const normalized = subject.toLowerCase().trim();
  
  // Try mapping first
  const mappedSubject = SUBJECT_MAPPING[normalized];
  if (mappedSubject) {
    const matches = MINIGAMES_DB.filter(game => game.subject === mappedSubject);
    if (matches.length > 0) {
      return matches;
    }
  }
  
  // Try exact match
  let matches = MINIGAMES_DB.filter(game => game.subject === subject);
  if (matches.length > 0) return matches;
  
  // Try case-insensitive match
  const lowerSubject = subject.toLowerCase();
  matches = MINIGAMES_DB.filter(game => game.subject.toLowerCase() === lowerSubject);
  if (matches.length > 0) return matches;
  
  // Try partial match (for translations)
  matches = MINIGAMES_DB.filter(game => 
    game.subject.toLowerCase().includes(lowerSubject) || 
    lowerSubject.includes(game.subject.toLowerCase())
  );
  
  return matches;
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
