'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing civic issues based on community engagement.
 *
 * - prioritizeIssuesBasedOnEngagement - A function that prioritizes issues based on likes, shares, and comments.
 * - PrioritizeIssuesBasedOnEngagementInput - The input type for the prioritizeIssuesBasedOnEngagement function.
 * - PrioritizeIssuesBasedOnEngagementOutput - The return type for the prioritizeIssuesBasedOnEngagement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeIssuesBasedOnEngagementInputSchema = z.object({
  issueDescription: z
    .string()
    .describe('The description of the civic issue.'),
  likes: z.number().describe('The number of likes the issue has received.'),
  shares: z.number().describe('The number of shares the issue has received.'),
  comments: z.number().describe('The number of comments the issue has received.'),
  priorityScore: z.number().optional().describe('Existing priority score, if any'),
});
export type PrioritizeIssuesBasedOnEngagementInput = z.infer<
  typeof PrioritizeIssuesBasedOnEngagementInputSchema
>;

const PrioritizeIssuesBasedOnEngagementOutputSchema = z.object({
  priorityScore: z
    .number()
    .describe(
      'A score indicating the priority of the issue, based on engagement metrics.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why the issue was assigned the given priority score.'
    ),
});
export type PrioritizeIssuesBasedOnEngagementOutput = z.infer<
  typeof PrioritizeIssuesBasedOnEngagementOutputSchema
>;

export async function prioritizeIssuesBasedOnEngagement(
  input: PrioritizeIssuesBasedOnEngagementInput
): Promise<PrioritizeIssuesBasedOnEngagementOutput> {
  return prioritizeIssuesBasedOnEngagementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeIssuesBasedOnEngagementPrompt',
  input: {schema: PrioritizeIssuesBasedOnEngagementInputSchema},
  output: {schema: PrioritizeIssuesBasedOnEngagementOutputSchema},
  prompt: `You are an AI assistant helping to prioritize civic issues based on community engagement.

  Given the following information about a civic issue, determine a priority score between 0 and 100, where 100 is the highest priority.

  Issue Description: {{{issueDescription}}}
  Likes: {{{likes}}}
  Shares: {{{shares}}}
  Comments: {{{comments}}}
  Existing Priority Score: {{priorityScore}}

  Consider the number of likes, shares, and comments as indicators of community interest and urgency. Issues with higher engagement should receive higher priority scores.  If there is an existing priority score, take that into account as well.

  Provide a brief explanation of your reasoning for the assigned priority score.
  `,
});

const prioritizeIssuesBasedOnEngagementFlow = ai.defineFlow(
  {
    name: 'prioritizeIssuesBasedOnEngagementFlow',
    inputSchema: PrioritizeIssuesBasedOnEngagementInputSchema,
    outputSchema: PrioritizeIssuesBasedOnEngagementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
