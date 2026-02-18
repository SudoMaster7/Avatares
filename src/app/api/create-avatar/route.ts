import { NextRequest, NextResponse } from "next/server";
import { generatePersona } from "@/services/persona-generator";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { characterName, videoRef } = body;

        if (!characterName) {
            return NextResponse.json(
                { error: "Character name is required" },
                { status: 400 }
            );
        }

        const persona = await generatePersona(characterName, videoRef);

        if (!persona) {
            return NextResponse.json(
                { error: "Failed to generate persona" },
                { status: 500 }
            );
        }

        return NextResponse.json(persona);
    } catch (error) {
        console.error("Error in /api/create-avatar:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
