import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY || '');

export interface TranscriptionOptions {
    language?: string;
    model?: string;
    punctuate?: boolean;
    interimResults?: boolean;
}

export async function transcribeAudio(
    audioBuffer: Buffer,
    options: TranscriptionOptions = {}
): Promise<string> {
    const {
        language = 'pt-BR',
        model = 'nova-2',
        punctuate = true,
    } = options;

    try {
        const { result } = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model,
                language,
                punctuate,
                smart_format: true,
            }
        );

        const transcript = result?.results?.channels[0]?.alternatives[0]?.transcript || '';
        return transcript;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw new Error('Failed to transcribe audio');
    }
}

export function createLiveTranscription(
    options: TranscriptionOptions = {}
) {
    const {
        language = 'pt-BR',
        model = 'nova-2',
        punctuate = true,
        interimResults = true,
    } = options;

    const connection = deepgram.listen.live({
        model,
        language,
        punctuate,
        interim_results: interimResults,
        smart_format: true,
    });

    return connection;
}

export { LiveTranscriptionEvents };
