// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Analyzes post engagement (likes, comments) to provide insights and summaries.
 *
 * - analyzePostEngagement - A function that analyzes post engagement.
 * - AnalyzePostEngagementInput - The input type for the analyzePostEngagement function.
 * - AnalyzePostEngagementOutput - The return type for the analyzePostEngagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePostEngagementInputSchema = z.object({
  postId: z.string().describe('The ID of the post to analyze.'),
  likesCount: z.number().describe('The number of likes the post has received.'),
  comments: z.array(z.string()).describe('A list of comments on the post.'),
});
export type AnalyzePostEngagementInput = z.infer<typeof AnalyzePostEngagementInputSchema>;

const AnalyzePostEngagementOutputSchema = z.object({
  engagementSummary: z.string().describe('A summary of the post engagement, including insights from likes and comments.'),
  suggestedImprovements: z.string().describe('Suggestions for improving future posts based on the engagement analysis.'),
});
export type AnalyzePostEngagementOutput = z.infer<typeof AnalyzePostEngagementOutputSchema>;

export async function analyzePostEngagement(input: AnalyzePostEngagementInput): Promise<AnalyzePostEngagementOutput> {
  return analyzePostEngagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePostEngagementPrompt',
  input: {schema: AnalyzePostEngagementInputSchema},
  output: {schema: AnalyzePostEngagementOutputSchema},
  prompt: `You are an AI social media engagement analyst. Analyze the engagement on the following post and provide a summary of the engagement and suggestions for improvement.

Post ID: {{{postId}}}
Likes: {{{likesCount}}}
Comments:
{{#each comments}}
- {{{this}}}
{{/each}}

---
Engagement Summary: This summarizes how users are reacting to the post based on likes and comments.

Suggested Improvements: Based on the engagement, provide clear and actionable suggestions for future posts to increase user engagement.
`,
});

const analyzePostEngagementFlow = ai.defineFlow(
  {
    name: 'analyzePostEngagementFlow',
    inputSchema: AnalyzePostEngagementInputSchema,
    outputSchema: AnalyzePostEngagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
