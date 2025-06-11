import { NextResponse } from 'next/server';
import { discoverRelatedPersonas } from '@/ai/flows/discover-related-personas';

// This ensures Genkit is initialized on the server
import '@/ai/genkit'; 

export async function POST(request: Request) {
  try {
    const input = await request.json();
    
    // Assuming the request body contains the input for discoverRelatedPersonas
    const result = await discoverRelatedPersonas(input);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error calling Genkit flow:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}