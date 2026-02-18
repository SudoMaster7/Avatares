/**
 * AI-Generated Mini-Game Questions API
 * Uses Groq to generate fresh, randomized quiz questions per subject.
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SUBJECT_MAP: Record<string, string> = {
  math: 'Matemática (álgebra, geometria, aritmética, cálculo básico)',
  portuguese: 'Língua Portuguesa (gramática, interpretação de texto, literatura, redação)',
  science: 'Ciências (biologia, física, química básica, ecologia)',
  history: 'História (Brasil, geral, política, sociedades)',
  geography: 'Geografia (Brasil, física, humana, cartografia)',
  english: 'Inglês (gramática, vocabulário, interpretação, expressões)',
  'physical-ed': 'Educação Física (esportes, saúde, fisiologia, regras)',
  art: 'Arte (pintura, escultura, história da arte, movimentos artísticos)',
  music: 'Música (teoria, história, instrumentos, ritmos)',
  philosophy: 'Filosofia (pensadores, correntes filosóficas, ética, lógica)',
  ethics: 'Filosofia e Sociologia (ética, cidadania, direitos humanos, política)',
  'computer-science': 'Informática e Computação (algoritmos, lógica, programação básica, internet)',
  spanish: 'Espanhol (gramática, vocabulário, interpretação, países hispanófonos)',
};

export async function POST(request: NextRequest) {
  try {
    const { subjectId, gameType = 'quiz', difficulty = 'médio', count = 5 } = await request.json();

    const subjectName = SUBJECT_MAP[subjectId] || subjectId;
    const safeCount = Math.min(Math.max(Number(count) || 5, 3), 10);

    let prompt = '';

    if (gameType === 'quiz' || gameType === 'speedchallenge') {
      prompt = `Gere ${safeCount} perguntas de múltipla escolha sobre "${subjectName}" com dificuldade "${difficulty}".

REGRAS OBRIGATÓRIAS:
- Cada pergunta deve ter EXATAMENTE 4 opções (A, B, C, D)
- Apenas UMA resposta correta por pergunta
- Perguntas variadas e interessantes para estudantes brasileiros do ensino médio
- NÃO repita perguntas similares
- Embaralhe a posição da resposta correta (não coloque sempre na primeira opção)

RETORNE SOMENTE JSON VÁLIDO (sem markdown, sem explicações):
[
  {
    "question": "texto da pergunta",
    "options": ["opção A", "opção B", "opção C", "opção D"],
    "correctAnswer": "texto exato de uma das opções"
  }
]`;
    } else if (gameType === 'truefalse') {
      prompt = `Gere ${safeCount} afirmações sobre "${subjectName}" para um jogo Verdadeiro/Falso com dificuldade "${difficulty}".

REGRAS:
- Misture verdadeiras e falsas (aproximadamente 50/50)
- Afirmações claras e objetivas
- Adequado para ensino médio

RETORNE SOMENTE JSON VÁLIDO:
[
  {
    "question": "texto da afirmação",
    "options": ["Verdadeiro", "Falso"],
    "correctAnswer": "Verdadeiro"
  }
]`;
    } else if (gameType === 'fillblank') {
      prompt = `Gere ${safeCount} perguntas de "completar lacuna" sobre "${subjectName}" com dificuldade "${difficulty}".

REGRAS:
- Use ___ para indicar a lacuna na frase
- Forneça 4 opções para completar
- Apenas uma correta

RETORNE SOMENTE JSON VÁLIDO:
[
  {
    "question": "A capital do ___ é Brasília.",
    "options": ["Brasil", "Argentina", "Chile", "Peru"],
    "correctAnswer": "Brasil"
  }
]`;
    } else {
      // Default quiz for other types
      prompt = `Gere ${safeCount} perguntas de múltipla escolha sobre "${subjectName}" com dificuldade "${difficulty}". Retorne SOMENTE JSON:
[{"question":"pergunta","options":["A","B","C","D"],"correctAnswer":"A"}]`;
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? '[]';

    // Extract JSON array
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response', questions: [] }, { status: 500 });
    }

    let questions: any[];
    try {
      questions = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from AI', questions: [] }, { status: 500 });
    }

    // Validate and clean up questions
    const valid = questions
      .filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2 && q.correctAnswer)
      .map((q, i) => ({
        id: `ai-${subjectId}-${Date.now()}-${i}`,
        text: q.question,
        type: gameType as any,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }));

    if (valid.length === 0) {
      return NextResponse.json({ error: 'No valid questions generated', questions: [] }, { status: 500 });
    }

    return NextResponse.json({ questions: valid, generated: true });
  } catch (error: any) {
    console.error('[minigame-questions]', error);
    return NextResponse.json({ error: error.message, questions: [] }, { status: 500 });
  }
}
