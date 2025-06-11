// use server'

/**
 * @fileOverview This file defines a Genkit flow for suggesting content types based on persona information,
 * content journey goals, and outreach channels.
 *
 * - suggestContentType - A function that takes persona information, content journey goals, and outreach channels
 *   and suggests appropriate content types.
 * - SuggestContentTypeInput - The input type for the suggestContentType function.
 * - SuggestContentTypeOutput - The return type for the suggestContentType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentTypeInputSchema = z.object({
  personaName: z.string().describe('The name of the target persona.'),
  personaLikes: z.string().describe('The likes of the target persona.'),
  personaDislikes: z.string().describe('The dislikes of the target persona.'),
  personaWorkTasks: z.string().describe('The work tasks of the target persona.'),
  contentJourneyGoal: z.string().describe('The goal of the content journey (e.g., net-new customers, upgrade, renewal, expand).'),
  outreachChannel: z.string().describe('The outreach channel for the content (e.g., social, email, website, community, video, event).'),
  keyMessaging: z.string().describe('The key messaging for the content.'),
});
export type SuggestContentTypeInput = z.infer<typeof SuggestContentTypeInputSchema>;

const SuggestContentTypeOutputSchema = z.object({
  suggestedContentType: z.string().describe('The suggested content type (e.g., blog post, webinar, case study, infographic).'),
  rationale: z.string().describe('The rationale for the suggested content type, explaining why it is appropriate for the persona, goal, and channel.'),
});
export type SuggestContentTypeOutput = z.infer<typeof SuggestContentTypeOutputSchema>;

export async function suggestContentType(input: SuggestContentTypeInput): Promise<SuggestContentTypeOutput> {
  return suggestContentTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentTypePrompt',
  input: {schema: SuggestContentTypeInputSchema},
  output: {schema: SuggestContentTypeOutputSchema},
  prompt: `You are a content marketing expert. Based on the provided persona information, content journey goal, and outreach channel, suggest the most effective content type to reach the target persona and achieve the content journey goal.

Persona Name: {{{personaName}}}
Persona Likes: {{{personaLikes}}}
Persona Dislikes: {{{personaDislikes}}}
Persona Work Tasks: {{{personaWorkTasks}}}
Content Journey Goal: {{{contentJourneyGoal}}}
Outreach Channel: {{{outreachChannel}}}
Key Messaging: {{{keyMessaging}}}

Consider the persona's likes, dislikes, and work tasks when suggesting the content type. Explain your reasoning for the content suggestion.`, 
});

const suggestContentTypeFlow = ai.defineFlow(
  {
    name: 'suggestContentTypeFlow',
    inputSchema: SuggestContentTypeInputSchema,
    outputSchema: SuggestContentTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
