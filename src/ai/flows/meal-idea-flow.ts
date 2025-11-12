'use server';
/**
 * @fileOverview A Genkit flow for generating meal ideas.
 *
 * This file defines the input and output schemas for the meal idea generator
 * and implements the flow that interacts with the generative AI model.
 *
 * - generateMealIdea - A function that generates a single meal idea.
 * - MealIdeaInput - The input type for the meal idea generation.
 * - MealIdeaOutput - The return type for the meal idea generation.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MealIdeaInputSchema = z.object({
  calorieTarget: z.number().describe('The target number of calories for the meal.'),
});
export type MealIdeaInput = z.infer<typeof MealIdeaInputSchema>;

export const MealIdeaOutputSchema = z.object({
  name: z.string().describe('The name of the meal.'),
  description: z.string().describe('A short, enticing description of the meal.'),
  calories: z.number().describe('The estimated number of calories in the meal.'),
});
export type MealIdeaOutput = z.infer<typeof MealIdeaOutputSchema>;


export async function generateMealIdea(input: MealIdeaInput): Promise<MealIdeaOutput> {
  return mealIdeaFlow(input);
}


const prompt = ai.definePrompt(
  {
    name: 'mealIdeaPrompt',
    input: {schema: MealIdeaInputSchema},
    output: {schema: MealIdeaOutputSchema},
    prompt: `You are a creative chef. Generate a meal idea with approximately {{{calorieTarget}}} calories. The meal should be healthy and easy to prepare.`,
  },
);

const mealIdeaFlow = ai.defineFlow(
  {
    name: 'mealIdeaFlow',
    inputSchema: MealIdeaInputSchema,
    outputSchema: MealIdeaOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
