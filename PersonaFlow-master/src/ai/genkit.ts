
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import nextGenkitPlugin from '@genkit-ai/next'; // Default import

export const ai = genkit({
  plugins: [
    nextGenkitPlugin, // Use the imported plugin object directly
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
