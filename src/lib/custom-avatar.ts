import { AvatarConfig } from "@/lib/avatars";

export function createCustomAvatarConfig(name: string, personality: string): AvatarConfig {
    return {
        id: `custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name: name,

        type: "historical",
        subject: "História Viva",
        description: "Avatar personalizado gerado por IA.",
        personality: personality,
        imageUrl: "/images/avatars/einstein.jpg", // Placeholder - eventually could be generated
        voiceConfig: {
            elevenLabsVoiceId: "ErXwobaYiN019PkySvjV", // Antoni (Default Male) - could be dynamic
            elevenLabsModelId: "eleven_multilingual_v2",
            stability: 0.5,
            similarityBoost: 0.75,
            rate: 1,
            pitch: 1,
            volume: 1
        },
        language: "pt-BR",
        difficulty: "Adaptive"
    };
}
