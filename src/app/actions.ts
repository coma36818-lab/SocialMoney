'use server';

import { analyzeTrends } from '@/ai/flows/ai-trend-analyzer';
import { z } from 'zod';

const AnalyzeTrendsInputSchema = z.object({
  socialMediaPlatform: z.enum(['Instagram', 'TikTok', 'YouTube']),
  userInterests: z.string().min(3, 'Please describe your interests.'),
  competitorContent: z.string().optional(),
});

export type FormState = {
  message: string;
  data?: {
    contentIdeas: string[];
    hotTopics: string[];
    idealPostingTimes: string;
  };
  fields?: Record<string, string>;
};

export async function getTrendAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = AnalyzeTrendsInputSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Please check your input.',
      fields: {
        ...Object.fromEntries(formData.entries()),
      },
    };
  }

  try {
    const result = await analyzeTrends(validatedFields.data);
    return {
      message: 'Analysis complete!',
      data: result,
    };
  } catch (e) {
    console.error(e);
    return {
      message: 'An error occurred during analysis. Please try again.',
      fields: {
        ...Object.fromEntries(formData.entries()),
      },
    };
  }
}
