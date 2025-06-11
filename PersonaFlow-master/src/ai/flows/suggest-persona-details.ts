
'use server';
/**
 * @fileOverview An AI agent that suggests likes and dislikes for a given persona.
 *
 * - suggestPersonaDetails - A function that suggests likes and dislikes.
 * - SuggestPersonaDetailsInput - The input type for the suggestPersonaDetails function.
 * - SuggestPersonaDetailsOutput - The return type for the suggestPersonaDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPersonaDetailsInputSchema = z.object({
  jobTitle: z.string().describe('The job title of the persona.'),
  industry: z.string().describe('The industry of the persona.'),
  workTasks: z.string().describe('The work tasks or pain points of the persona.'),
});
export type SuggestPersonaDetailsInput = z.infer<typeof SuggestPersonaDetailsInputSchema>;

const SuggestPersonaDetailsOutputSchema = z.object({
  likes: z.string().describe('A comma-separated list of 3-5 likes for the persona. These should be concise and relevant to their professional life.'),
  dislikes: z.string().describe('A comma-separated list of 3-5 dislikes for the persona. These should be concise and relevant to their professional life.'),
});
export type SuggestPersonaDetailsOutput = z.infer<typeof SuggestPersonaDetailsOutputSchema>;

export async function suggestPersonaDetails(input: SuggestPersonaDetailsInput): Promise<SuggestPersonaDetailsOutput> {
  return suggestPersonaDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPersonaDetailsPrompt',
  input: {schema: SuggestPersonaDetailsInputSchema},
  output: {schema: SuggestPersonaDetailsOutputSchema},
  prompt: `You are an expert in persona development and market research.
Based on the provided persona information, generate a concise list of 3-5 professional likes and 3-5 professional dislikes.
These should be comma-separated strings.

Persona Details:
Job Title: {{{jobTitle}}}
Industry: {{{industry}}}
Work Tasks/Pain Points: {{{workTasks}}}

Generate plausible likes and dislikes that someone in this role, industry, and with these tasks might have.
Focus on professional aspects.

Example Likes: efficiency, clear communication, data-driven decisions, innovative solutions, achieving targets
Example Dislikes: bureaucracy, micromanagement, pointless meetings, outdated technology, unclear objectives

Output format should be a JSON object with "likes" and "dislikes" keys, where each value is a comma-separated string.`,
});

const suggestPersonaDetailsFlow = ai.defineFlow(
  {
    name: 'suggestPersonaDetailsFlow',
    inputSchema: SuggestPersonaDetailsInputSchema,
    outputSchema: SuggestPersonaDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get suggestions from AI.');
    }
    return output;
  }
);
