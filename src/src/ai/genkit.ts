'use server';
/**
 * @fileOverview Initializes and configures the Genkit AI instance.
 *
 * This file sets up the AI plugins and exports a single `ai` object
 * that can be used throughout the application to interact with generative models.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// IMPORTANT: This 'ai' instance is used for defining flows and does NOT contain the
// API key. The actual initialization with the API key is moved to a server-side
// wrapper to ensure it only runs on the server and avoids client-side errors.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
