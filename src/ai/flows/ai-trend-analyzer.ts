'use server';

/**
 * @fileOverview Analyzes social media trends and suggests content ideas.
 *
 * - analyzeTrends - Analyzes trends and suggests content ideas.
 * - AnalyzeTrendsInput - Input for the analyzeTrends function.
 * - AnalyzeTrendsOutput - Output of the analyzeTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTrendsInputSchema = z.object({
  socialMediaPlatform: z.enum(['Instagram', 'TikTok', 'YouTube']).describe('The social media platform to analyze.'),
  userInterests: z.string().describe('The user\u0027s interests to incorporate into content ideas.'),
  competitorContent: z.string().optional().describe('Optional: Examples of content from competitors.'),
});

export type AnalyzeTrendsInput = z.infer<typeof AnalyzeTrendsInputSchema>;

const AnalyzeTrendsOutputSchema = z.object({
  contentIdeas: z.array(z.string()).describe('Content ideas based on trends, interests, and competitor content.'),
  hotTopics: z.array(z.string()).describe('Current hot topics on the specified platform.'),
  idealPostingTimes: z.string().describe('Suggested posting times for optimal engagement.'),
});

export type AnalyzeTrendsOutput = z.infer<typeof AnalyzeTrendsOutputSchema>;

export async function analyzeTrends(input: AnalyzeTrendsInput): Promise<AnalyzeTrendsOutput> {
  return analyzeTrendsFlow(input);
}

const trendAnalysisPrompt = ai.definePrompt({
  name: 'trendAnalysisPrompt',
  input: {schema: AnalyzeTrendsInputSchema},
  output: {schema: AnalyzeTrendsOutputSchema},
  prompt: `You are a social media strategist who analyzes trends and suggests content ideas.

  Analyze trends on {{{socialMediaPlatform}}} based on the following information:
  User Interests: {{{userInterests}}}
  
  {{~#if competitorContent~}}
  Competitor Content:
  {{competitorContent}}
  {{~/if~}}

  Provide content ideas, hot topics, and ideal posting times to maximize engagement.
  Format the ideal posting times as a single string in the format "Days: Times".
  For content ideas and hot topics, give at least 3 suggestions.
  Make sure to consider the latest trends for 2025.
  `,
});

const analyzeTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeTrendsFlow',
    inputSchema: AnalyzeTrendsInputSchema,
    outputSchema: AnalyzeTrendsOutputSchema,
  },
  async input => {
    const {output} = await trendAnalysisPrompt(input);
    return output!;
  }
);
