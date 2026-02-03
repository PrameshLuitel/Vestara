
'use server';
/**
 * @fileOverview A RAG-based AI flow for Vestara GPT.
 * This flow instructs the Gemini model to act as a specialized financial assistant
 * for the Nepalese market, using a predefined set of authoritative websites as its
 * primary knowledge source. It can also use tools to access real-time data, like
 * stock forecasts.
 *
 * - vestaraGpt - A function that handles the chat interaction.
 * - VestaraGptInput - The input type for the vestaraGpt function.
 * - VestaraGptOutput - The return type for the vestaraGpt function.
 */

import { ai } from '@/ai/genkit';
import { getLatestForecastData } from '@/services/google-sheets';
import { z } from 'genkit';

const VestaraGptInputSchema = z.object({
  query: z.string(),
});
export type VestaraGptInput = z.infer<typeof VestaraGptInputSchema>;

export type VestaraGptOutput = string;

const systemPrompt = `You are Vestara GPT, a specialized AI assistant for the Nepalese financial market. Your purpose is to provide accurate, factual information, acting as an expert with deep knowledge of the content typically found on the following authoritative sources:
- sharesansar.com
- sebon.gov.np
- cdsc.com.np
- nepalstock.com
- sban.com.np
- merolagani.com

You are an expert in SEBON regulations, NEPSE operational workflows, and investment banking in Nepal. Frame your answers as if you are drawing from this deep knowledge base.

When asked about stock forecasts, predictions, or data from the "Predictive Suite", you MUST use the provided 'getForecastData' tool to retrieve the latest information.

CRITICAL RULES:
1.  **NEVER** use any information from outside the listed websites or the provided tools. Your knowledge is strictly confined to this data.
2.  If a user asks a question that cannot be answered using information from these sources (e.g., general knowledge, international markets, personal opinions), you MUST politely refuse. State that your knowledge is limited to the Nepalese financial ecosystem as documented on your sources.
3.  **DO NOT HALLUCINATE.** If you do not have the information from the specified sources, state that you cannot provide an answer.
4.  Answer concisely and professionally.
5.  Your goal is to be a RAG (Retrieval-Augmented Generation) model. Act as if you are retrieving the information directly from these sources or tools before answering.`;

const getForecastData = ai.defineTool(
  {
    name: 'getForecastData',
    description: 'Get the latest 7-day stock forecast data for all NEPSE-listed companies from the Predictive Suite.',
    inputSchema: z.object({
      symbol: z.string().optional().describe('Optional stock symbol to filter the forecast data for a specific company.'),
    }),
    outputSchema: z.string().describe('A JSON string containing the forecast data. If a symbol is provided, it returns data for that symbol only. Otherwise, it returns data for all available symbols.'),
  },
  async (input) => {
    const data = await getLatestForecastData();
    if (input?.symbol) {
        const symbolData = data[input.symbol.toUpperCase()];
        if (symbolData) {
            return JSON.stringify({ [input.symbol.toUpperCase()]: symbolData });
        } else {
            return `No forecast data was found for the symbol: ${input.symbol}`;
        }
    }
    return JSON.stringify(data);
  }
);


export const vestaraGpt = ai.defineFlow(
  {
    name: 'vestaraGptFlow',
    inputSchema: VestaraGptInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: `The user's query is: ${input.query}`,
      tools: [getForecastData]
    });
  
    const responseText = llmResponse.text;
    if (!responseText) {
      const toolUse = llmResponse.toolRequest?.name;
      if (toolUse === 'getForecastData') {
        const toolResponse = llmResponse.toolResponse?.content as string;
        try {
          const data = JSON.parse(toolResponse);
          if (data.error) {
            return data.error;
          }
          // Let the model summarize the tool's JSON response.
          const summaryResponse = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: `The user asked for a stock forecast and the data has been retrieved. Please summarize the following JSON data in a user-friendly way:\n\n${toolResponse}`,
          });
          return summaryResponse.text ?? 'I was able to retrieve the forecast data, but could not summarize it.';
        } catch (e) {
          return 'I received a forecast from the tool, but it was in a format I could not understand.';
        }
      }
      return 'I am sorry, but I could not generate a response.';
    }

    return responseText;
  }
);
