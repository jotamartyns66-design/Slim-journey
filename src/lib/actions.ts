'use server';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import { generateMealIdea } from '@/ai/flows/meal-idea-flow';
import { suggestOutdoorActivity } from '@/ai/flows/outdoor-activity-flow';

// This function ensures that the AI instance with the API key is created and used only on the server,
// right when the server action is called. This prevents the API key from ever being accessed on the client.
const withServerAuth = <I, O>(flow: (input: I) => Promise<O>) => {
  return async (input: I): Promise<O> => {
    // The actual initialization with the API key happens here, safely on the server.
    // This ensures process.env.GEMINI_API_KEY is only read on the server.
    genkit.config({
      plugins: [
        googleAI({
          apiKey: process.env.GEMINI_API_KEY,
        }),
      ],
      // You can add server-specific configurations like logging here
    });
    return flow(input);
  };
};

export const generateMealIdeaAction = withServerAuth(generateMealIdea);
export const suggestOutdoorActivityAction = withServerAuth(suggestOutdoorActivity);


export const generateRecommendation = async (input: { netCalories: number }): Promise<string> => {
    const ai = genkit({
        plugins: [
          googleAI({
            apiKey: process.env.GEMINI_API_KEY,
          }),
        ],
    });

    const recommendationFlow = ai.defineFlow(
        {
          name: 'generateRecommendation',
          inputSchema: z.object({ netCalories: z.number() }),
          outputSchema: z.string(),
        },
        async ({ netCalories }) => {
          let prompt;
          if (netCalories > 200) {
            prompt = `My net calorie intake for today is ${netCalories}, which is a surplus. Give me a short, encouraging, and actionable tip for tomorrow to get back on track. Keep it under 50 words. Address me directly.`;
          } else if (netCalories < -200) {
            prompt = `My net calorie intake for today is ${netCalories}, which is a significant deficit. Give me a short, encouraging, and positive reinforcement message. Keep it under 50 words. Address me directly.`;
          } else {
            prompt = `My net calorie intake for today is ${netCalories}, which is within my target range. Give me a short, encouraging message congratulating me on my balanced day. Keep it under 50 words. Address me directly.`;
          }
          
          const { text } = await ai.generate({
            prompt,
            model: 'googleai/gemini-1.5-flash-latest',
            config: { temperature: 0.8 },
          });
          return text;
        }
    );

    return recommendationFlow(input);
};
