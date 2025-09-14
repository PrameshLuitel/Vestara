// src/app/api/vestara-gpt/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {vestaraGpt, type VestaraGptInput} from '@/ai/flows/vestaraGptFlow';

export const maxDuration = 60; // Set the maximum duration for this function to 60 seconds

export async function POST(req: NextRequest) {
  try {
    const {query} = (await req.json()) as VestaraGptInput;

    if (!query) {
      return NextResponse.json(
        {error: 'Query parameter is required'},
        {status: 400}
      );
    }

    const response = await vestaraGpt({query});

    return NextResponse.json({response});
  } catch (error: any) {
    console.error('Error in Vestara GPT API route:', error);
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred'},
      {status: 500}
    );
  }
}
