'use server';
/**
 * @fileOverview A Genkit flow for suggesting outdoor activities based on weather.
 *
 * This file defines the input and output schemas for the outdoor activity suggester
 * and implements the flow that interacts with the generative AI model.
 *
 * - suggestOutdoorActivity - A function that suggests an activity.
 * - OutdoorActivityInput - The input type for the suggestion.
 * - OutdoorActivityOutput - The return type for the suggestion.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const OutdoorActivityInputSchema = z.object({
  weather: z.enum(['sunny', 'cloudy', 'rainy', 'snowy']).describe('The current weather condition.'),
  temperature: z.number().describe('The current temperature in Celsius.'),
});
export type OutdoorActivityInput = z.infer<typeof OutdoorActivityInputSchema>;

export const OutdoorActivityOutputSchema = z.object({
  activity: z.string().describe('The suggested outdoor activity.'),
  reason: z.string().describe('A short reason why this activity is a good choice for the current weather.'),
});
export type OutdoorActivityOutput = z.infer<typeof OutdoorActivityOutputSchema>;


export async function suggestOutdoorActivity(input: OutdoorActivityInput): Promise<OutdoorActivityOutput> {
  return outdoorActivityFlow(input);
}


const prompt = ai.definePrompt(
  {
    name: 'outdoorActivityPrompt',
    input: {schema: OutdoorActivityInputSchema},
    output: {schema: OutdoorActivityOutputSchema},
    prompt: `You are a helpful assistant who loves the outdoors.
    The weather is currently {{weather}} and the temperature is {{temperature}}°C.
    Suggest a fun and safe outdoor activity suitable for these conditions.
    Be creative and encouraging.`,
  },
);

const outdoorActivityFlow = ai.defineFlow(
  {
    name: 'outdoorActivityFlow',
    inputSchema: OutdoorActivityInputSchema,
    outputSchema: OutdoorActivityOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
