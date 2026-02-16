import { NextRequest, NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';

// Initialize client with API key
const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_CLOUD_TTS_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { text, language = 'pt-BR', voiceName } = await request.json();

        // Select voice based on language and avatar
        const selectedVoice = voiceName || (language === 'pt-BR' ? 'pt-BR-Wavenet-B' : 'en-US-Wavenet-D');

        // Construct the request
        const [response] = await client.synthesizeSpeech({
            input: { text },
            voice: {
                languageCode: language,
                name: selectedVoice,
            },
            audioConfig: {
                audioEncoding: 'MP3' as const,
                speakingRate: 1.0,
                pitch: 0.0,
            },
        });

        // Return audio as base64
        const audioContent = response.audioContent;
        if (!audioContent) {
            throw new Error('No audio content generated');
        }

        return NextResponse.json({
            audio: Buffer.from(audioContent).toString('base64'),
            contentType: 'audio/mp3',
        });
    } catch (error: any) {
        console.error('Error generating speech:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate speech' },
            { status: 500 }
        );
    }
}
