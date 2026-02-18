import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export interface PersonaProfile {
    name: string;
    contextoTemporal: string;
    personalidade: string;
    limitacaoConhecimento: string;
    missaoEducativa: string;
    systemPrompt: string;
}

export async function generatePersona(characterName: string, videoRef?: string): Promise<PersonaProfile | null> {
    if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY is not set");
        return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const metaPrompt = `
    Aja como um Historiador Especialista em Pedagogia Imersiva. O teu objetivo é criar um "System Prompt" detalhado para um agente de IA que irá interagir com crianças e jovens.

    Ao receber o NOME DE UM PERSONAGEM: "${characterName}"
    ${videoRef ? `E dado o contexto do vídeo assistido: "${videoRef}"` : ""}

    Retorne APENAS um JSON (sem markdown, sem \`\`\`json) com a seguinte estrutura:

    {
      "name": "Nome Completo com Título (ex: Sir Isaac Newton)",
      "contextoTemporal": "O momento exato da vida dele (ex: 1666, durante a peste em Londres)",
      "personalidade": "Adjetivos de comportamento e forma de falar (ex: Curioso, recluso, usa termos da época)",
      "limitacaoConhecimento": "O que ele NÃO pode saber (eventos futuros à sua época)",
      "missaoEducativa": "Qual o conceito principal que ele deve ensinar durante a conversa",
      "systemPrompt": "O texto final COMPLETO que será injetado na API de chat. Deve começar com 'Você é [Nome] em [Ano]...'. Inclua instruções de tom, restrições e objetivo."
    }

    Certifique-se de que o \`systemPrompt\` seja imersivo, educativo e seguro para menores (sem linguagem imprópria). O personagem NÃO deve saber que é uma IA.
  `;

    try {
        const result = await model.generateContent(metaPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks if the model ignores the instruction
        const jsonString = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

        return JSON.parse(jsonString) as PersonaProfile;
    } catch (error) {
        console.error("Error generating persona:", error);
        return null;
    }
}
