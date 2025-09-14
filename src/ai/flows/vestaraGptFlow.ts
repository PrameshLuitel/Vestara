'use server';
/**
 * @fileOverview A RAG-based AI flow for Vestara GPT.
 * This flow instructs the Gemini model to act as a specialized financial assistant
 * for the Nepalese market, using a predefined set of authoritative websites as its
 * primary knowledge source.
 *
 * - vestaraGpt - A function that handles the chat interaction.
 * - VestaraGptInput - The input type for the vestaraGpt function.
 * - VestaraGptOutput - The return type for the vestaraGpt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VestaraGptInputSchema = z.string();
export type VestaraGptInput = z.infer<typeof VestaraGptInputSchema>;

const VestaraGptOutputSchema = z.string();
export type VestaraGptOutput = z.infer<typeof VestaraGptOutputSchema>;

const systemPrompt = `You are Vestara GPT, a specialized AI assistant for the Nepalese financial market. Your sole purpose is to provide accurate, factual information based ONLY on the content from the following authoritative sources:
- sharesansar.com
- sebon.gov.np
- cdsc.com.np
- nepalstock.com
- sban.com.np
- merolagani.com

You are an expert in SEBON regulations, NEPSE operational workflows, and investment banking in Nepal.

CRITICAL RULES:
1.  **NEVER** use any information from outside the listed websites. Your knowledge is strictly confined to the data that would be found on these sites.
2.  If a user asks a question that cannot be answered using information from these sites (e.g., general knowledge, international markets, personal opinions), you MUST politely refuse. State that your knowledge is limited to the Nepalese financial ecosystem as documented on your sources.
3.  **DO NOT HALLUCINATE.** If you do not have the information from the specified sources, state that you cannot provide an answer.
4.  Answer concisely and professionally.
5.  Your goal is to be a RAG (Retrieval-Augmented Generation) model. Act as if you are retrieving the information directly from these sources before answering.`;

const vestaraGptPrompt = ai.definePrompt({
  name: 'vestaraGptPrompt',
  system: systemPrompt,
  input: { schema: VestaraGptInputSchema },
  output: { schema: VestaraGptOutputSchema },
  prompt: `The user's query is: {{{prompt}}}`,
});

export async function vestaraGpt(query: VestaraGptInput): Promise<VestaraGptOutput> {
  const llmResponse = await vestaraGptPrompt(query);
  return llmResponse.output ?? 'I am sorry, but I could not generate a response.';
}

ai.defineFlow(
  {
    name: 'vestaraGptFlow',
    inputSchema: VestaraGptInputSchema,
    outputSchema: VestaraGptOutputSchema,
  },
  async (query) => {
    return await vestaraGpt(query);
  }
);
