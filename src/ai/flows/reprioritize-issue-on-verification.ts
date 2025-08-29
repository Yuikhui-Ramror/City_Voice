'use server';

/**
 * @fileOverview This file defines a Genkit flow for re-prioritizing a civic issue when its validity is verified by an administrator.
 *
 * - reprioritizeIssueOnVerification - A function that adjusts an issue's priority score based on its verification status.
 * - ReprioritizeIssueOnVerificationInput - The input type for the reprioritizeIssueOnVerification function.
 * - ReprioritizeIssueOnVerificationOutput - The return type for the reprioritizeIssueOnVerification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReprioritizeIssueOnVerificationInputSchema = z.object({
  issueDescription: z
    .string()
    .describe('The description of the civic issue.'),
  engagement: z.object({
    likes: z.number(),
    comments: z.number(),
    shares: z.number(),
  }),
  currentPriority: z.number().describe('The current priority score of the issue.'),
  isVerified: z.boolean().describe('Whether the issue has been verified as valid by an administrator.'),
});
export type ReprioritizeIssueOnVerificationInput = z.infer<
  typeof ReprioritizeIssueOnVerificationInputSchema
>;

const ReprioritizeIssueOnVerificationOutputSchema = z.object({
  newPriorityScore: z
    .number()
    .describe(
      'The new, adjusted priority score for the issue.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation for why the new priority score was assigned.'
    ),
});
export type ReprioritizeIssueOnVerificationOutput = z.infer<
  typeof ReprioritizeIssueOnVerificationOutputSchema
>;

export async function reprioritizeIssueOnVerification(
  input: ReprioritizeIssueOnVerificationInput
): Promise<ReprioritizeIssueOnVerificationOutput> {
  return reprioritizeIssueOnVerificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reprioritizeIssueOnVerificationPrompt',
  input: {schema: ReprioritizeIssueOnVerificationInputSchema},
  output: {schema: ReprioritizeIssueOnVerificationOutputSchema},
  prompt: `You are an AI assistant for a civic engagement platform. Your task is to re-evaluate the priority of an issue after an administrator has verified its validity.

  Verification by an admin confirms the issue is real and requires attention. This should significantly increase its priority.

  Issue Description: {{{issueDescription}}}
  Current Priority: {{{currentPriority}}}
  Verified: {{{isVerified}}}
  Engagement:
  - Likes: {{{engagement.likes}}}
  - Comments: {{{engagement.comments}}}
  - Shares: {{{engagement.shares}}}

  If 'Verified' is true, significantly increase the priority score (on a scale of 0-100). The increase should reflect the certainty that this is a real-world problem needing a solution. A verified, highly-engaged issue should be among the highest priorities.

  If 'Verified' is false, this means the report was invalid. The priority should be set to 0.

  Calculate a new priority score and provide a brief justification.`,
});

const reprioritizeIssueOnVerificationFlow = ai.defineFlow(
  {
    name: 'reprioritizeIssueOnVerificationFlow',
    inputSchema: ReprioritizeIssueOnVerificationInputSchema,
    outputSchema: ReprioritizeIssueOnVerificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
