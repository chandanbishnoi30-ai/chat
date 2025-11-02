'use server';

/**
 * @fileOverview AI-powered smart reply suggestions flow.
 *
 * - generateSmartReplySuggestions - A function that generates smart reply suggestions for an incoming message.
 * - GenerateSmartReplySuggestionsInput - The input type for the generateSmartReplySuggestions function.
 * - GenerateSmartReplySuggestionsOutput - The return type for the generateSmartReplySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartReplySuggestionsInputSchema = z.object({
  message: z.string().describe('The incoming message to generate reply suggestions for.'),
  context: z.string().optional().describe('Context about the conversation. Limited to 20 words.'),
});
export type GenerateSmartReplySuggestionsInput = z.infer<typeof GenerateSmartReplySuggestionsInputSchema>;

const GenerateSmartReplySuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested replies to the incoming message.'),
});
export type GenerateSmartReplySuggestionsOutput = z.infer<typeof GenerateSmartReplySuggestionsOutputSchema>;

export async function generateSmartReplySuggestions(input: GenerateSmartReplySuggestionsInput): Promise<GenerateSmartReplySuggestionsOutput> {
  return generateSmartReplySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartReplySuggestionsPrompt',
  input: {schema: GenerateSmartReplySuggestionsInputSchema},
  output: {schema: GenerateSmartReplySuggestionsOutputSchema},
  prompt: `You are a helpful assistant that provides smart reply suggestions for incoming messages.

  The suggestions should be short, relevant, and helpful in continuing the conversation.
  The suggestions should be appropriate given this context:
  {{context}}
  Generate a maximum of 3 suggestions.

  Incoming Message: {{{message}}}`,
});

const generateSmartReplySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSmartReplySuggestionsFlow',
    inputSchema: GenerateSmartReplySuggestionsInputSchema,
    outputSchema: GenerateSmartReplySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
