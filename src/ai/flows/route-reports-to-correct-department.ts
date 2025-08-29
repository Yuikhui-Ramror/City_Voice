'use server';
/**
 * @fileOverview Automatically routes reports to the correct department based on issue description, category, and location.
 *
 * - routeReport - A function that handles the report routing process.
 * - RouteReportInput - The input type for the routeReport function.
 * - RouteReportOutput - The return type for the routeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteReportInputSchema = z.object({
  description: z.string().describe('The description of the issue reported.'),
  category: z.string().describe('The category of the issue reported.'),
  location: z.string().describe('The location of the issue reported.'),
});
export type RouteReportInput = z.infer<typeof RouteReportInputSchema>;

const RouteReportOutputSchema = z.object({
  department: z.string().describe('The department to which the report should be routed.'),
  reason: z.string().describe('The reason for routing the report to the specified department.'),
});
export type RouteReportOutput = z.infer<typeof RouteReportOutputSchema>;

export async function routeReport(input: RouteReportInput): Promise<RouteReportOutput> {
  return routeReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'routeReportPrompt',
  input: {schema: RouteReportInputSchema},
  output: {schema: RouteReportOutputSchema},
  prompt: `You are an expert in civic issue routing. Given the description, category, and location of a reported issue, you will determine the most appropriate department to handle the report.

Description: {{{description}}}
Category: {{{category}}}
Location: {{{location}}}

Based on this information, determine the appropriate department and provide a brief reason for your decision.
`,
});

const routeReportFlow = ai.defineFlow(
  {
    name: 'routeReportFlow',
    inputSchema: RouteReportInputSchema,
    outputSchema: RouteReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
