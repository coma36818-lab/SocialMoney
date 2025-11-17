'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a post caption based on the media content.
 *
 * The flow takes an image or video data URI as input and returns a suggested caption.
 * It uses the googleai/gemini-2.5-flash model to generate the caption.
 *
 * @interface SuggestPostCaptionInput - Input type for the suggestPostCaption function.
 * @interface SuggestPostCaptionOutput - Output type for the suggestPostCaption function.
 * @function suggestPostCaption - The main function to generate a post caption.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostCaptionInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "The media content (image or video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestPostCaptionInput = z.infer<typeof SuggestPostCaptionInputSchema>;

const SuggestPostCaptionOutputSchema = z.object({
  caption: z.string().describe('A suggested caption for the post.'),
});
export type SuggestPostCaptionOutput = z.infer<typeof SuggestPostCaptionOutputSchema>;

export async function suggestPostCaption(input: SuggestPostCaptionInput): Promise<SuggestPostCaptionOutput> {
  return suggestPostCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPostCaptionPrompt',
  input: {schema: SuggestPostCaptionInputSchema},
  output: {schema: SuggestPostCaptionOutputSchema},
  prompt: `You are a social media expert. Generate a short and engaging caption for a post, based on the media content.

Media: {{media url=mediaDataUri}}

Caption:`,
});

const suggestPostCaptionFlow = ai.defineFlow(
  {
    name: 'suggestPostCaptionFlow',
    inputSchema: SuggestPostCaptionInputSchema,
    outputSchema: SuggestPostCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
