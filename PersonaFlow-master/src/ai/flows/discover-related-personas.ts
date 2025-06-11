// use server'
'use server';

/**
 * @fileOverview An AI agent that identifies related personas based on a given persona's job title, work tasks, and industry.
 *
 * - discoverRelatedPersonas - A function that identifies related personas.
 * - DiscoverRelatedPersonasInput - The input type for the discoverRelatedPersonas function.
 * - DiscoverRelatedPersonasOutput - The return type for the discoverRelatedPersonas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverRelatedPersonasInputSchema = z.object({
  jobTitle: z.string().describe('The job title of the persona.'),
  workTasks: z.string().describe('The work tasks of the persona.'),
  industry: z.string().describe('The industry of the persona.'),
});

export type DiscoverRelatedPersonasInput = z.infer<
  typeof DiscoverRelatedPersonasInputSchema
>;

const DiscoverRelatedPersonasOutputSchema = z.object({
  relatedPersonas: z
    .array(
      z.object({
        jobTitle: z.string().describe('The job title of the related persona.'),
        likelyRoleInBuyingJourney: z
          .string()
          .describe('The likely role of the related persona in the buying journey.'),
        reasoning: z
          .string()
          .describe('Reasoning behind the suggestion of the related persona.'),
      })
    )
    .describe('A list of related personas and their likely roles.'),
});

export type DiscoverRelatedPersonasOutput = z.infer<
  typeof DiscoverRelatedPersonasOutputSchema
>;

export async function discoverRelatedPersonas(
  input: DiscoverRelatedPersonasInput
): Promise<DiscoverRelatedPersonasOutput> {
  return discoverRelatedPersonasFlow(input);
}

const discoverRelatedPersonasPrompt = ai.definePrompt({
  name: 'discoverRelatedPersonasPrompt',
  input: {schema: DiscoverRelatedPersonasInputSchema},
  output: {schema: DiscoverRelatedPersonasOutputSchema},
  prompt: `You are an expert in B2B sales and marketing. Given a buyer persona's job title, work tasks, and industry, you can identify other personas that they are likely to interact with during the buying journey.

Job Title: {{{jobTitle}}}
Work Tasks: {{{workTasks}}}
Industry: {{{industry}}}

Identify up to 3 related personas, their likely role in the buying journey, and your reasoning for suggesting them. Format the output as a JSON array of objects with 'jobTitle', 'likelyRoleInBuyingJourney', and 'reasoning' keys.

Output:`,
});

const discoverRelatedPersonasFlow = ai.defineFlow(
  {
    name: 'discoverRelatedPersonasFlow',
    inputSchema: DiscoverRelatedPersonasInputSchema,
    outputSchema: DiscoverRelatedPersonasOutputSchema,
  },
  async input => {
    const {output} = await discoverRelatedPersonasPrompt(input);
    return output!;
  }
);
