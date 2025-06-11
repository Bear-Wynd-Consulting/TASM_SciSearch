import { NextResponse } from 'next/server';
import { suggestPersonaDetails } from '@/ai/flows/suggest-persona-details';

// This ensures Genkit is initialized on the server
import '@/ai/genkit';

export async function POST(request: Request) {
  try {
    const input = await request.json();

    // Assuming the request body contains the input for suggestPersonaDetails
    const result = await suggestPersonaDetails(input);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error calling suggestPersonaDetails flow:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}